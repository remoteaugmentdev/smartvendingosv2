'use client'

import { useState, useEffect, useTransition } from 'react'
import { addDays, format, isPast } from 'date-fns'
import { Plus, Trash2, RefreshCw, Copy, Check } from 'lucide-react'
import { createDemoAccount, revokeDemoAccount, listDemoAccounts, type DemoUser } from './actions'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function AdminUsersClient() {
  const [users, setUsers] = useState<DemoUser[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  const [label, setLabel] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [daysValid, setDaysValid] = useState(3)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [copiedPassword, setCopiedPassword] = useState(false)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoadError(null)
    const result = await listDemoAccounts()
    if (result.error) setLoadError(result.error)
    else setUsers(result.users ?? [])
  }

  function handleGeneratePassword() {
    const pw = generatePassword()
    setPassword(pw)
    setCopiedPassword(false)
  }

  function handleCopyPassword() {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopiedPassword(true)
    setTimeout(() => setCopiedPassword(false), 2000)
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)
    const expiresAt = addDays(new Date(), daysValid).toISOString()

    startTransition(async () => {
      const result = await createDemoAccount({ email, password, label, expiresAt })
      if (result.error) {
        setFormError(result.error)
      } else {
        const expDate = format(addDays(new Date(), daysValid), 'MMM d, yyyy')
        setFormSuccess(`Account created — expires ${expDate}. Share the credentials with your client.`)
        setEmail('')
        setPassword('')
        setLabel('')
        loadUsers()
      }
    })
  }

  function handleRevoke(userId: string) {
    startTransition(async () => {
      await revokeDemoAccount(userId)
      loadUsers()
    })
  }

  return (
    <div className="space-y-6">
      {/* Create form */}
      <Card>
        <h3 className="mb-1 text-sm font-semibold text-[var(--text-primary)]">
          Create Demo Account
        </h3>
        <p className="mb-5 text-xs text-[var(--text-muted)]">
          The account auto-expires after the chosen window. Share the email and password directly with your client.
        </p>

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Label */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">
              Client label
            </label>
            <input
              required
              placeholder="e.g. Acme Corp"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--text-primary)] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email + expiry row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Demo email
              </label>
              <input
                type="email"
                required
                placeholder="demo@client.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--text-primary)] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Access window
              </label>
              <select
                value={daysValid}
                onChange={(e) => setDaysValid(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={4}>4 days</option>
                <option value={7}>7 days</option>
              </select>
            </div>
          </div>

          {/* Password row */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-muted)]">
              Password
            </label>
            <div className="flex gap-2">
              <input
                required
                placeholder="Set a password for the client"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-white px-3 text-sm text-[var(--text-primary)] placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleGeneratePassword}
                title="Generate random password"
              >
                <RefreshCw size={14} />
                Generate
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCopyPassword}
                disabled={!password}
                title="Copy password"
              >
                {copiedPassword ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={isPending}>
              <Plus size={15} />
              {isPending ? 'Creating…' : 'Create demo account'}
            </Button>
            {formError && <p className="text-xs text-[var(--accent-danger)]">{formError}</p>}
            {formSuccess && <p className="text-xs text-emerald-600">{formSuccess}</p>}
          </div>
        </form>
      </Card>

      {/* Accounts table */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Demo Accounts</h3>
          <Button variant="ghost" size="sm" onClick={loadUsers} disabled={isPending}>
            <RefreshCw size={14} />
            Refresh
          </Button>
        </div>

        {loadError && (
          <p className="mb-4 text-xs text-[var(--accent-danger)]">{loadError}</p>
        )}

        <Table>
          <Thead>
            <Tr>
              <Th>Client</Th>
              <Th>Email</Th>
              <Th>Expires</Th>
              <Th>Status</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {users.length === 0 ? (
              <Tr>
                <Td colSpan={5} className="py-10 text-center text-[var(--text-muted)]">
                  No demo accounts yet. Create one above to get started.
                </Td>
              </Tr>
            ) : (
              users.map((u) => {
                const expired = isPast(new Date(u.expires_at))
                return (
                  <Tr key={u.id}>
                    <Td className="font-medium">{u.label}</Td>
                    <Td className="text-[var(--text-muted)]">{u.email}</Td>
                    <Td className="text-[var(--text-muted)]">
                      {format(new Date(u.expires_at), 'MMM d, yyyy')}
                    </Td>
                    <Td>
                      <Badge variant={expired ? 'danger' : 'success'}>
                        {expired ? 'Expired' : 'Active'}
                      </Badge>
                    </Td>
                    <Td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevoke(u.id)}
                        disabled={isPending}
                        className="text-[var(--accent-danger)] hover:bg-red-50"
                        title="Revoke access"
                      >
                        <Trash2 size={14} />
                        Revoke
                      </Button>
                    </Td>
                  </Tr>
                )
              })
            )}
          </Tbody>
        </Table>
      </Card>
    </div>
  )
}
