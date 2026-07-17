import { pool } from '@/utils/db'

// ponytail: schema kept up to date on every call instead of a migration; move to setup-db.mjs if it grows further
export async function ensureLeadsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.leads (
      id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name        text,
      email            text,
      company          text NOT NULL,
      fleet_size       text,
      pain_point       text,
      current_solution text,
      slug             text,
      created_at       timestamptz NOT NULL DEFAULT now()
    )
  `)

  await pool.query(`
    ALTER TABLE public.leads ALTER COLUMN full_name DROP NOT NULL;
    ALTER TABLE public.leads ALTER COLUMN email DROP NOT NULL;
    ALTER TABLE public.leads ALTER COLUMN fleet_size DROP NOT NULL;
    ALTER TABLE public.leads ALTER COLUMN pain_point DROP NOT NULL;
    ALTER TABLE public.leads ALTER COLUMN current_solution DROP NOT NULL;
    ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS slug text;
    ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS custom_message text;
  `)

  // unique index (not a table constraint) so multiple NULL slugs (organic submissions) coexist
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS leads_slug_key ON public.leads (slug)`)
}
