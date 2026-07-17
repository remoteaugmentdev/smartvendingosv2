import { pool } from '@/utils/db'
import { ensureLeadsTable } from '@/utils/leadsSchema'
import HomePage from '../page'

type Props = {
  params: Promise<{ company: string }>
}

async function getCustomMessage(slug: string): Promise<string | undefined> {
  try {
    await ensureLeadsTable()
    const { rows } = await pool.query<{ custom_message: string | null }>(
      `SELECT custom_message FROM public.leads WHERE slug = $1`,
      [slug]
    )
    return rows[0]?.custom_message ?? undefined
  } catch (err) {
    if ((err as { code?: string }).code === '42P01') return undefined
    throw err
  }
}

// Note: a slug matching a reserved top-level route name (e.g. "dashboard",
// "settings", "login") will resolve to that static route instead of here,
// since Next.js resolves static segments before dynamic ones.
export default async function CompanyLandingPage({ params }: Props) {
  const { company } = await params
  const displayName = decodeURIComponent(company)
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
  const customText = await getCustomMessage(company)

  return <HomePage companyName={displayName} customText={customText} slug={company} />
}
