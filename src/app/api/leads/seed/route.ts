import { NextResponse, type NextRequest } from 'next/server'
import { pool } from '@/utils/db'
import { ensureLeadsTable } from '@/utils/leadsSchema'

export async function POST(request: NextRequest) {
  try {
    const { company, slug, message } = await request.json()

    if (!company?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 })
    }

    await ensureLeadsTable()

    await pool.query(
      `INSERT INTO public.leads (company, slug, custom_message) VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET company = EXCLUDED.company, custom_message = EXCLUDED.custom_message`,
      [company.trim(), slug.trim(), message?.trim() || null]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/leads/seed]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
