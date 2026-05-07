// FILE: src/app/siret-mapping/page.tsx
'use client'

import { useState } from 'react'
import { Search, Check, RefreshCw, X } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/utils/cn'
import { ldaProducts, ldaMachines, ldaProducers } from '@/data/lda'
import type { MappingStatus, EslStatus } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function maskSiret(s: string) {
  if (s.length < 9) return s
  return s.slice(0, 6) + '...' + s.slice(-3)
}

function mappingVariant(status: MappingStatus): 'success' | 'warning' | 'danger' {
  if (status === 'verified') return 'success'
  if (status === 'pending')  return 'warning'
  return 'danger'
}

function eslVariant(status: EslStatus): 'success' | 'warning' | 'default' | 'danger' {
  if (status === 'synced')       return 'success'
  if (status === 'out_of_sync')  return 'warning'
  if (status === 'never_pushed') return 'default'
  return 'danger'
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function SiretMappingPage() {
  const t = useTranslation()
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [machineFilter, setMachineFilter] = useState('all')
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // Slide-in panel
  const [showPanel, setShowPanel]       = useState(false)
  const [panelProduct, setPanelProduct] = useState<(typeof ldaProducts)[number] | null>(null)
  const [siretInput, setSiretInput]     = useState('')
  const [producerName, setProducerName] = useState('')
  const [siretValid, setSiretValid]     = useState<boolean | null>(null)

  // Row-level overrides
  const [productStatuses, setProductStatuses] = useState<Record<string, MappingStatus>>({})
  const [eslStatuses, setEslStatuses]         = useState<Record<string, EslStatus>>({})
  const [repushingIds, setRepushingIds]       = useState<string[]>([])

  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  function eslLabel(status: EslStatus) {
    if (status === 'synced')       return t.synced
    if (status === 'out_of_sync')  return t.outOfSync
    if (status === 'never_pushed') return t.neverPushed
    return t.pushFailed
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = ldaProducts.filter((p) => {
    const effectiveStatus = productStatuses[p.id] ?? p.mappingStatus
    const matchSearch  = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.aisleCode.toLowerCase().includes(search.toLowerCase()) ||
                         (p.siret ?? '').includes(search)
    const matchStatus  = statusFilter === 'all' || effectiveStatus === statusFilter
    const matchMachine = machineFilter === 'all' || p.machines.includes(machineFilter)
    return matchSearch && matchStatus && matchMachine
  })

  const allSelected  = filtered.length > 0 && filtered.every((p) => selectedRows.includes(p.id))
  const someSelected = selectedRows.length > 0

  function toggleAll() {
    if (allSelected) setSelectedRows([])
    else setSelectedRows(filtered.map((p) => p.id))
  }

  function toggleRow(id: string) {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id])
  }

  // ── Panel ──────────────────────────────────────────────────────────────────
  function openPanel(p: (typeof ldaProducts)[number]) {
    setPanelProduct(p)
    setSiretInput(p.siret ?? '')
    setProducerName(p.producer ?? '')
    setSiretValid(p.siret?.length === 14 ? true : null)
    setShowPanel(true)
  }

  function handlePanelSiret(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 14)
    setSiretInput(digits)
    if (digits.length === 14) {
      const found = ldaProducers.find((pr) => pr.siret === digits)
      setProducerName(found?.name ?? '')
      setSiretValid(true)
    } else {
      setSiretValid(null)
      setProducerName('')
    }
  }

  function handlePanelSave() {
    if (!panelProduct) return
    setProductStatuses((prev) => ({ ...prev, [panelProduct.id]: 'verified' }))
    setShowPanel(false)
    showToast(`✓ SIRET verified for ${panelProduct.name}`)
  }

  // ── ESL Re-push ────────────────────────────────────────────────────────────
  function handleRepush(productId: string) {
    setRepushingIds((prev) => [...prev, productId])
    setTimeout(() => {
      setEslStatuses((prev) => ({ ...prev, [productId]: 'synced' }))
      setRepushingIds((prev) => prev.filter((id) => id !== productId))
      const product = ldaProducts.find((p) => p.id === productId)
      showToast(`✓ ESL label pushed for ${product?.name ?? productId}`)
    }, 1000)
  }

  function handleRepushAll() {
    const ids = ldaProducts.map((p) => p.id)
    setRepushingIds(ids)
    setTimeout(() => {
      const overrides: Record<string, EslStatus> = {}
      ids.forEach((id) => { overrides[id] = 'synced' })
      setEslStatuses(overrides)
      setRepushingIds([])
      showToast('✓ All ESL labels pushed successfully')
    }, 1500)
  }

  function mappingBadgeLabel(status: MappingStatus) {
    if (status === 'verified') return t.verified
    if (status === 'pending')  return t.pending
    return t.unmapped
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t.siretMapping}
        description={t.siretSubtitle}
      />

      {/* ── KPI Row ──────────────────────────────────────────────────────── */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Card hover={false} className="border-t-2 border-blue-500">
          <p className="text-xs font-medium text-[var(--text-muted)]">{t.mappedProducts}</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">24 / 30</p>
        </Card>
        <Card hover={false} className="border-t-2 border-amber-400">
          <p className="text-xs font-medium text-[var(--text-muted)]">{t.unmappedPending}</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">6</p>
        </Card>
        <Card hover={false} className="border-t-2 border-emerald-500">
          <p className="text-xs font-medium text-[var(--text-muted)]">{t.validatedSirets}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">2,841</p>
        </Card>
      </div>

      {/* ── Main Table Card ───────────────────────────────────────────────── */}
      <Card hover={false} className="mb-6">
        <CardHeader>
          <CardTitle>Product SIRET Registry</CardTitle>
        </CardHeader>

        {/* Filter Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product, SIRET, aisle…"
              className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">{t.allStatuses}</option>
            <option value="verified">{t.verified}</option>
            <option value="pending">{t.pending}</option>
            <option value="unmapped">{t.unmapped}</option>
          </select>
          <select
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
            className="h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">{t.allMachines}</option>
            {ldaMachines.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Bulk Action Bar */}
        {someSelected && (
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5">
            <span className="text-xs font-medium text-blue-700">{selectedRows.length} selected</span>
            <div className="ml-auto flex gap-2">
              <Button variant="primary" size="sm">{t.assignSiretBulk}</Button>
              <Button variant="secondary" size="sm">{t.exportUnmapped}</Button>
            </div>
          </div>
        )}

        <Table>
          <Thead>
            <Tr>
              <Th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label={t.selectAll}
                  className="rounded border-[var(--border)]"
                />
              </Th>
              <Th>{t.product}</Th>
              <Th>{t.category}</Th>
              <Th>Machine IDs</Th>
              <Th>{t.aisleCode}</Th>
              <Th>{t.siretId}</Th>
              <Th>{t.producer}</Th>
              <Th>{t.status}</Th>
              <Th>{t.actions}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((p) => {
              const effectiveStatus = productStatuses[p.id] ?? p.mappingStatus
              return (
                <Tr key={p.id}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(p.id)}
                      onChange={() => toggleRow(p.id)}
                      className="rounded border-[var(--border)]"
                    />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
                        p.category === 'Beverages'  ? 'bg-blue-500'  :
                        p.category === 'Snacks'     ? 'bg-amber-500' :
                        p.category === 'Fresh Food' ? 'bg-green-500' : 'bg-slate-500'
                      )}>
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{p.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant="default">{p.category}</Badge>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-0.5">
                      {p.machines.map((mid) => (
                        <span key={mid} className="font-mono text-xs text-[var(--text-muted)]">{mid}</span>
                      ))}
                    </div>
                  </Td>
                  <Td className="font-mono text-xs">{p.aisleCode}</Td>
                  <Td className="font-mono text-xs text-[var(--text-muted)]">
                    {p.siret ? maskSiret(p.siret) : <span className="italic">—</span>}
                  </Td>
                  <Td className="text-sm">{p.producer ?? <span className="italic text-[var(--text-muted)]">—</span>}</Td>
                  <Td>
                    <Badge variant={mappingVariant(effectiveStatus)}>
                      {mappingBadgeLabel(effectiveStatus)}
                    </Badge>
                  </Td>
                  <Td>
                    <Button variant="secondary" size="sm" onClick={() => openPanel(p)}>
                      {t.assignSiret}
                    </Button>
                  </Td>
                </Tr>
              )
            })}
            {filtered.length === 0 && (
              <Tr>
                <Td colSpan={9} className="py-8 text-center text-[var(--text-muted)]">
                  No products match your filters.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Card>

      {/* ── ESL Sync Status Panel ─────────────────────────────────────────── */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>{t.eslSyncStatus}</CardTitle>
          <Button variant="primary" size="sm" onClick={handleRepushAll}>
            {t.repushAll}
          </Button>
        </CardHeader>

        <Table>
          <Thead>
            <Tr>
              <Th>{t.machine}</Th>
              <Th>{t.slot}</Th>
              <Th>{t.product}</Th>
              <Th>{t.labelStatus}</Th>
              <Th>{t.lastPushed}</Th>
              <Th>{t.actions}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {ldaProducts.map((p) => {
              const effectiveEsl = eslStatuses[p.id] ?? p.eslStatus
              const isRepushing  = repushingIds.includes(p.id)
              return (
                <Tr key={p.id}>
                  <Td className="font-mono text-xs text-[var(--text-muted)]">
                    {p.machines[0] ?? '—'}
                  </Td>
                  <Td className="font-mono text-xs">{p.aisleCode}</Td>
                  <Td className="font-medium text-sm">{p.name}</Td>
                  <Td>
                    <Badge variant={eslVariant(effectiveEsl)}>
                      {eslLabel(effectiveEsl)}
                    </Badge>
                  </Td>
                  <Td className="text-xs text-[var(--text-muted)]">
                    {fmtDate(p.eslLastPushed)}
                  </Td>
                  <Td>
                    <button
                      onClick={() => handleRepush(p.id)}
                      disabled={isRepushing}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-slate-50 transition-colors disabled:opacity-60"
                    >
                      <RefreshCw className={cn('h-3 w-3', isRepushing && 'animate-spin')} />
                      {isRepushing ? 'Pushing…' : t.rePush}
                    </button>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Card>

      {/* ── Right Slide-in Panel ─────────────────────────────────────────── */}
      {showPanel && panelProduct && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowPanel(false)}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-80 flex-col bg-[var(--bg-card)] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{t.assignSiret}</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Product info */}
              <div className="rounded-xl bg-slate-50 px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">{t.product}</span>
                  <span className="font-medium text-[var(--text-primary)]">{panelProduct.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">{t.machine}</span>
                  <span className="font-mono text-[var(--text-primary)]">{panelProduct.machines[0] ?? '—'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">{t.slot}</span>
                  <span className="font-mono text-[var(--text-primary)]">{panelProduct.aisleCode}</span>
                </div>
              </div>

              {/* SIRET input */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{t.siretId} — {t.siretHelper}</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={siretInput}
                    onChange={(e) => handlePanelSiret(e.target.value)}
                    maxLength={14}
                    placeholder="00000000000000"
                    className={cn(
                      'h-9 w-full rounded-xl border bg-[var(--bg-card)] px-3 pr-9 text-sm font-mono text-[var(--text-primary)] focus:outline-none focus:ring-2',
                      siretValid === true
                        ? 'border-emerald-400 focus:ring-emerald-400'
                        : siretInput.length > 0
                        ? 'border-amber-400 focus:ring-amber-400'
                        : 'border-[var(--border)] focus:ring-blue-400'
                    )}
                  />
                  {siretValid === true && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  )}
                </div>
                {siretInput.length > 0 && siretInput.length < 14 && (
                  <p className="mt-1 text-xs text-amber-600">{14 - siretInput.length} digits remaining</p>
                )}
                {siretValid === true && (
                  <p className="mt-1 text-xs text-emerald-600">
                    {producerName ? `${t.validSiret} — ${producerName}` : `${t.validSiret} — ${t.unknownProducer}`}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-5 py-4 flex gap-2">
              <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowPanel(false)}>
                {t.cancel}
              </Button>
              <Button variant="primary" size="md" className="flex-1" onClick={handlePanelSave}
                disabled={siretInput.length !== 14}>
                {t.confirm} &amp; {t.save}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
