'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ExternalLink, Inbox, Search } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { BarChartWrapper } from '@/components/charts/BarChartWrapper'

// ponytail: BarChartWrapper isn't self-marked 'use client', so it can only be pulled into a
// Server Component through an already-client boundary. This file is that boundary.
export function LeadsChart({ data }: { data: { day: string; count: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads, last 7 days</CardTitle>
      </CardHeader>
      <BarChartWrapper
        data={data}
        bars={[{ key: 'count', label: 'Leads', color: 'var(--accent-primary)' }]}
        xKey="day"
        height={160}
      />
    </Card>
  )
}

export type Lead = {
  id: string
  full_name: string | null
  email: string | null
  company: string
  fleet_size: string | null
  pain_point: string | null
  current_solution: string | null
  created_at: string
  slug: string | null
}

const HIGH_PRIORITY_FLEETS = ['51-200', '200+']
const FLEET_OPTIONS = ['all', '1-10', '11-50', '51-200', '200+'] as const

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [search, setSearch] = useState('')
  const [fleetFilter, setFleetFilter] = useState<(typeof FLEET_OPTIONS)[number]>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter((l) => {
      const matchSearch =
        !q ||
        (l.full_name ?? '').toLowerCase().includes(q) ||
        (l.email ?? '').toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q)
      const matchFleet = fleetFilter === 'all' || l.fleet_size === fleetFilter
      return matchSearch && matchFleet
    })
  }, [leads, search, fleetFilter])

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">All leads</h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company"
              className="h-9 w-56 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-8 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={fleetFilter}
            onChange={(e) => setFleetFilter(e.target.value as (typeof FLEET_OPTIONS)[number])}
            className="h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All fleet sizes</option>
            {FLEET_OPTIONS.filter((f) => f !== 'all').map((f) => (
              <option key={f} value={f}>{f} machines</option>
            ))}
          </select>
          <span className="text-xs text-[var(--text-muted)]">{filtered.length} of {leads.length}</span>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <Inbox size={28} className="text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-primary)]">No leads yet.</p>
          <p className="text-xs text-[var(--text-muted)]">
            They appear here as soon as someone starts the interactive demo.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <Inbox size={28} className="text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-primary)]">No leads match your search.</p>
        </div>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Company</Th>
              <Th>Fleet size</Th>
              <Th>Biggest challenge</Th>
              <Th>Current solution</Th>
              <Th>Submitted</Th>
              <Th>Link</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((l) => (
              <Tr key={l.id}>
                <Td className="font-medium">{l.full_name ?? <span className="text-[var(--text-muted)]">—</span>}</Td>
                <Td>
                  {l.email ? (
                    <a href={`mailto:${l.email}`} className="text-blue-600 hover:underline">
                      {l.email}
                    </a>
                  ) : (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </Td>
                <Td>{l.company}</Td>
                <Td>
                  {l.fleet_size ? (
                    <Badge variant={HIGH_PRIORITY_FLEETS.includes(l.fleet_size) ? 'success' : 'default'}>
                      {l.fleet_size} machines
                    </Badge>
                  ) : (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </Td>
                <Td className="max-w-[26ch] truncate text-[var(--text-muted)]" title={l.pain_point ?? undefined}>
                  {l.pain_point ?? <span className="text-[var(--text-muted)]">—</span>}
                </Td>
                <Td className="max-w-[26ch] truncate text-[var(--text-muted)]" title={l.current_solution ?? undefined}>
                  {l.current_solution ?? <span className="text-[var(--text-muted)]">—</span>}
                </Td>
                <Td className="text-[var(--text-muted)]">
                  {format(new Date(l.created_at), 'MMM d, yyyy HH:mm')}
                </Td>
                <Td>
                  {l.slug ? (
                    <a
                      href={`/${l.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-xs font-medium text-[var(--text-primary)] transition-all hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
                    >
                      <ExternalLink size={12} />
                      Open
                    </a>
                  ) : (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Card>
  )
}
