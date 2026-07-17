import { NextResponse } from 'next/server'
import { getSession } from '@/utils/session'
import { pool } from '@/utils/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null })

  const { rows } = await pool.query(
    `SELECT p.role, p.expires_at, p.label, u.email, u.updated_at
     FROM public.profiles p
     JOIN auth.users u ON u.id = p.id
     WHERE p.id = $1`,
    [session.userId]
  )
  const profile = rows[0] ?? null

  // If the account was updated after this session was issued, force re-login
  if (profile?.updated_at && session.iat) {
    const accountUpdatedAt = new Date(profile.updated_at).getTime()
    const sessionIssuedAt = session.iat * 1000
    if (accountUpdatedAt > sessionIssuedAt) {
      return NextResponse.json({ user: null })
    }
  }

  let label: string | null = profile?.label ?? null
  if (session.slug) {
    const { rows: leadRows } = await pool.query(
      `SELECT company FROM public.leads WHERE slug = $1`,
      [session.slug]
    )
    if (leadRows[0]?.company) label = leadRows[0].company
  }

  return NextResponse.json({
    user: {
      id: session.userId,
      email: profile?.email ?? session.email,
      role: profile?.role ?? session.role,
      expires_at: profile?.expires_at ?? null,
      label,
      slug: session.slug ?? null,
    },
  })
}
