import { getSession } from '@/utils/session'
import { pool } from '@/utils/db'

/** Lightweight shim so existing server actions can call createServerSupabaseClient()
 *  without needing any Supabase credentials. */
export async function createServerSupabaseClient() {
  const session = await getSession()

  return {
    auth: {
      async getUser() {
        if (!session) return { data: { user: null } }
        return { data: { user: { id: session.userId, email: session.email } } }
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
              }
            },
          }
        },
      }
    },
  }
}
