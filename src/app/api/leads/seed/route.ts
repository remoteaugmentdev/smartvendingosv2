import { NextResponse, type NextRequest } from 'next/server'
import { pool } from '@/utils/db'
import { ensureLeadsTable } from '@/utils/leadsSchema'

export async function POST(request: NextRequest) {
  try {
    const { company, slug } = await request.json()

    if (!company?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 })
    }

    await ensureLeadsTable()

    await pool.query(
      `INSERT INTO public.leads (company, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
      [company.trim(), slug.trim()]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/leads/seed]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
