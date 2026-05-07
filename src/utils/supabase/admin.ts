import { pool } from '@/utils/db'

// Server-only direct DB admin helpers — no Supabase keys required
export function createAdminClient() {
  return {
    auth: {
      admin: {
        async createUser(params: {
          email: string
          password: string
          email_confirm?: boolean
          user_metadata?: Record<string, unknown>
        }) {
          try {
            const meta = params.user_metadata ?? {}
            const metaJson = JSON.stringify(meta)
            const res = await pool.query(
              `INSERT INTO auth.users (
                instance_id, id, aud, role, email, encrypted_password,
                email_confirmed_at, created_at, updated_at, raw_user_meta_data
              ) VALUES (
                '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
                'authenticated', 'authenticated', $1, crypt($2, gen_salt('bf')),
                now(), now(), now(), $3::jsonb
              ) RETURNING id`,
              [params.email, params.password, metaJson]
            )
            const userId = res.rows[0].id

            // Insert identity
            await pool.query(
              `INSERT INTO auth.identities
                (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id)
               VALUES
                (gen_random_uuid(), $1, jsonb_build_object('sub',$2::text,'email',$3::text), 'email', now(), now(), now(), $2::text)`,
              [userId, userId, params.email]
            )

            // Insert profile
            const role = (meta.role as string) ?? 'demo'
            const label = (meta.label as string) ?? null
            const expiresAt = (meta.expires_at as string) ?? null
            await pool.query(
              `INSERT INTO public.profiles (id, email, role, label, expires_at)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (id) DO NOTHING`,
              [userId, params.email, role, label, expiresAt]
            )

            return { error: null }
          } catch (err: unknown) {
            return { error: { message: (err as Error).message } }
          }
        },

        async deleteUser(userId: string) {
          try {
            await pool.query(`DELETE FROM auth.users WHERE id = $1`, [userId])
            return { error: null }
          } catch (err: unknown) {
            return { error: { message: (err as Error).message } }
          }
        },

        async listUsers() {
          try {
            const res = await pool.query(
              `SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC`
            )
            return { data: { users: res.rows }, error: null }
          } catch (err: unknown) {
            return { data: { users: [] }, error: { message: (err as Error).message } }
          }
        },
      },
    },

    from(table: string) {
      return {
        select(columns = '*') {
          return {
            eq(col: string, val: unknown) {
              return {
                async single() {
                  try {
                    const res = await pool.query(
                      `SELECT ${columns} FROM public.${table} WHERE ${col} = $1 LIMIT 1`,
                      [val]
                    )
                    return { data: res.rows[0] ?? null, error: null }
                  } catch (err: unknown) {
                    return { data: null, error: { message: (err as Error).message } }
                  }
                },
                async then(resolve: (v: { data: unknown[]; error: null }) => void) {
                  const res = await pool.query(
                    `SELECT ${columns} FROM public.${table} WHERE ${col} = $1`,
                    [val]
                  )
                  resolve({ data: res.rows, error: null })
                },
              }
            },
          }
        },
      }
    },
  }
}
