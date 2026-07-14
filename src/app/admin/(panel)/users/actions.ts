'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import { pool } from '@/utils/db'
import { redirect } from 'next/navigation'

export interface DemoUser {
  id: string
  email: string
  label: string
  expires_at: string
  created_at: string
}

async function assertMaster() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'master') redirect('/dashboard')
  return user
}

export async function createDemoAccount(params: {
  email: string
  password: string
  label: string
  expiresAt: string
}): Promise<{ error?: string }> {
  const master = await assertMaster()
  const admin = createAdminClient()

  const { error } = await admin.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
    user_metadata: {
      role: 'demo',
      expires_at: params.expiresAt,
      label: params.label,
      created_by: master.id,
    },
  })

  if (error) return { error: error.message }
  return {}
}

export async function revokeDemoAccount(userId: string): Promise<{ error?: string }> {
  await assertMaster()
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return { error: error.message }
  return {}
}

export async function listDemoAccounts(): Promise<{ users?: DemoUser[]; error?: string }> {
  await assertMaster()

  try {
    const res = await pool.query(`
      SELECT p.id, u.email, COALESCE(p.label, u.email) AS label, p.expires_at, p.created_at
      FROM public.profiles p
      JOIN auth.users u ON u.id = p.id
      WHERE p.role = 'demo'
      ORDER BY p.created_at DESC
    `)
    return { users: res.rows }
  } catch (err: unknown) {
    return { error: (err as Error).message }
  }
}
