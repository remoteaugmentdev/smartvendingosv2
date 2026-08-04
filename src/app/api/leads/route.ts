import { NextResponse, type NextRequest } from 'next/server'
import { pool } from '@/utils/db'
import { signSession, getSessionFromRequest, COOKIE_NAME } from '@/utils/session'
import { ensureLeadsTable } from '@/utils/leadsSchema'
import { slugify } from '@/utils/slug'

const FLEET_SIZES = ['1-10', '11-50', '51-200', '200+']
const PAIN_POINTS = ['Inventory Management', 'Route Inefficiency', 'Revenue Tracking', 'Machine Downtime']
const SOLUTIONS = ['Excel/Pen & Paper', 'Nayax', 'Cantaloupe', 'Parlevel', 'Other']

/** Inserts under the first candidate slug that is still free; slug is unique */
async function insertLead(fields: string[], candidates: string[]) {
  for (const slug of candidates) {
    const { rows } = await pool.query(
      `INSERT INTO public.leads (full_name, email, company, fleet_size, pain_point, current_solution, slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING
       RETURNING id`,
      [...fields, slug]
    )
    if (rows[0]) return { id: rows[0].id as string, slug }
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, company, fleetSize, painPoint, currentSolution, slug } = await request.json()

    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !company?.trim() ||
      !FLEET_SIZES.includes(fleetSize) ||
      !PAIN_POINTS.includes(painPoint) ||
      !SOLUTIONS.includes(currentSolution)
    ) {
      return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 })
    }

    await ensureLeadsTable()

    const trimmedSlug = slug?.trim()
    let leadId: string | undefined
    // The slug this lead ends up owning: it goes into the session so exiting the
    // demo returns to their own link, even when they signed up from the bare page
    let leadSlug: string | undefined = trimmedSlug || undefined

    if (trimmedSlug) {
      const { rows } = await pool.query(
        `UPDATE public.leads SET full_name=$1, email=$2, company=$3, fleet_size=$4, pain_point=$5, current_solution=$6
         WHERE slug=$7
         RETURNING id`,
        [fullName.trim(), email.trim(), company.trim(), fleetSize, painPoint, currentSolution, trimmedSlug]
      )
      if (rows[0]) leadId = rows[0].id
    }

    if (!leadId) {
      // Submissions from the bare landing page carry no slug, so derive one from the
      // company: every lead ends up with an openable demo link in the admin table.
      const fields = [fullName.trim(), email.trim(), company.trim(), fleetSize, painPoint, currentSolution]
      const base = trimmedSlug || slugify(company) || 'demo'
      // Another company may already own the plain slug, so keep a suffixed fallback
      const inserted = await insertLead(fields, [base, `${base}-${Math.random().toString(36).slice(2, 6)}`])
      if (!inserted) throw new Error(`could not allocate a slug for "${company.trim()}"`)
      leadId = inserted.id
      leadSlug = inserted.slug
    }

    const response = NextResponse.json({ ok: true, slug: leadSlug })

    // Drop the prospect straight into the demo dashboard, but never
    // downgrade a signed-in master testing the form — keep their own
    // identity/role, just attach the slug so the UI reflects which
    // company link they're currently testing
    const existing = await getSessionFromRequest(request)
    const token = existing?.role === 'master'
      ? await signSession({ userId: existing.userId, email: existing.email, role: existing.role, slug: leadSlug })
      : await signSession({ userId: leadId!, email: email.trim(), role: 'demo', slug: leadSlug })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days, same as login
    })
    return response
  } catch (err) {
    console.error('[api/leads]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
