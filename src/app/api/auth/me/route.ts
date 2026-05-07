import { NextResponse } from 'next/server'
import { getSession } from '@/utils/session'
import { pool } from '@/utils/db'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null })

  const { rows } = await pool.query(
    `SELECT p.role, p.expires_at, p.label
     FROM public.profiles p
     WHERE p.id = $1`,
    [session.userId]
  )
  const profile = rows[0] ?? null

  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      role: profile?.role ?? session.role,
      expires_at: profile?.expires_at ?? null,
      label: profile?.label ?? null,
    },
  })
}
