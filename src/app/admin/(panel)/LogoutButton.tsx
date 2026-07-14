'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  return (
    <button onClick={logout} className="hover:text-[var(--text-primary)]">
      Logout
    </button>
  )
}
