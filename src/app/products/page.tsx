// FILE: src/app/products/page.tsx
'use client'

import { useState } from 'react'
import { Pencil, Search, X, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/utils/cn'
import { ldaProducts, ldaProductCategories } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function categoryColor(cat: string) {
  switch (cat) {
    case 'Beverages':  return 'bg-blue-500'
    case 'Snacks':     return 'bg-amber-500'
    case 'Fresh Food': return 'bg-green-500'
    case 'Office':     return 'bg-slate-500'
    default:           return 'bg-slate-400'
  }
}

type Product = Omit<(typeof ldaProducts)[number], 'siret' | 'producer'> & {
  siret: string | null
  producer: string | null
}
type Category = (typeof ldaProductCategories)[number]

const EMPTY_PRODUCT: Omit<Product, 'id' | 'totalSales' | 'totalRevenue' | 'eslLastPushed'> & {
  id: string; totalSales: number; totalRevenue: number; siret: string | null; producer: string | null; eslLastPushed: string | null
} = {
  id: '', name: '', category: 'Beverages', price: 0, barcode: '',
  siret: '', producer: '', status: 'active',
  mappingStatus: 'pending', eslStatus: 'never_pushed', eslLastPushed: null,
  stock: 0, capacity: 0, reorderLevel: 0, totalSales: 0, totalRevenue: 0,
  machines: [], aisleCode: '',
}

export default function ProductsPage() {
  const t = useTranslation()
  const [activeTab, setActiveTab]         = useState<'database' | 'category'>('database')
  const [search, setSearch]               = useState('')
  const [catSearch, setCatSearch]         = useState('')
  const [showModal, setShowModal]         = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Modal form fields
  const [formName, setFormName]           = useState('')
  const [formCategory, setFormCategory]   = useState('Beverages')
  const [formPrice, setFormPrice]         = useState('')
  const [formBarcode, setFormBarcode]     = useState('')
  const [activeToggle, setActiveToggle]   = useState(true)
  const [toast, setToast]                 = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  function openAdd() {
    setEditingProduct(null)
    setFormName(''); setFormCategory('Beverages'); setFormPrice(''); setFormBarcode('')
    setActiveToggle(true)
    setShowModal(true)
  }

  function openEdit(p: Product) {
    setEditingProduct(p)
    setFormName(p.name); setFormCategory(p.category)
    setFormPrice(String(p.price)); setFormBarcode(p.barcode)
    setActiveToggle(p.status === 'active')
    setShowModal(true)
  }

  function handleSave() {
    showToast(`Product ${editingProduct ? 'updated' : 'added'} successfully`)
    setShowModal(false)
  }

  function stockBadge(stock: number, reorderLevel: number, capacity: number) {
    if (stock === 0)               return <Badge variant="danger">{t.outOfStock}</Badge>
    if (stock <= reorderLevel)     return <Badge variant="warning">{t.low}</Badge>
    return <Badge variant="success">{t.inStock}</Badge>
  }

  const filteredProducts = ldaProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCategories = ldaProductCategories.filter((c) =>
    c.name.toLowerCase().includes(catSearch.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-2xl p-6">
      <PageHeader
        title="Product Catalog"
        description="Manage your product catalog and categories"
      />

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="mb-5 flex border-b border-[var(--border)]">
        {(['database', 'category'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {tab === 'database' ? 'Product Catalog' : 'Categories'}
          </button>
        ))}
      </div>

      {/* ── Product Database Tab ──────────────────────────────────────────── */}
      {activeTab === 'database' && (
        <Card hover={false}>
          {/* Search + Add */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <Button variant="primary" size="md" onClick={openAdd}>
              {t.addProduct}
            </Button>
          </div>

          {/* Product List */}
          <div className="space-y-2">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3"
              >
                {/* Avatar */}
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white', categoryColor(p.category))}>
                  {p.name.charAt(0)}
                </div>

                {/* Name + category */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{p.name}</p>
                  <Badge variant="default" className="mt-0.5">{p.category}</Badge>
                </div>

                {/* Price */}
                <span className="shrink-0 text-sm font-semibold text-[var(--text-primary)]">
                  ${p.price.toFixed(2)}
                </span>

                {/* Stock */}
                <div className="shrink-0">
                  {stockBadge(p.stock, p.reorderLevel, p.capacity)}
                </div>

                {/* Edit */}
                <button
                  onClick={() => openEdit(p)}
                  aria-label={t.edit}
                  className="shrink-0 rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text-primary)] transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">No products match your search.</p>
            )}
          </div>
        </Card>
      )}

      {/* ── Product Category Tab ─────────────────────────────────────────── */}
      {activeTab === 'category' && (
        <Card hover={false}>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder={t.search}
                className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <Button variant="secondary" size="md">
              {t.addCategory}
            </Button>
          </div>

          <Table>
            <Thead>
              <Tr>
                <Th className="hidden sm:table-cell">S/N</Th>
                <Th>{t.category}</Th>
                <Th>{t.productCount}</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCategories.map((c, i) => (
                <Tr key={c.id}>
                  <Td className="hidden sm:table-cell text-[var(--text-muted)] font-mono text-xs">{i + 1}</Td>
                  <Td className="font-medium">{c.name}</Td>
                  <Td>
                    <Badge variant="info">{c.productCount}</Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        aria-label={t.edit}
                        className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text-primary)] transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        aria-label={t.delete}
                        className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      )}

      {/* ── Bottom Sheet Modal ───────────────────────────────────────────── */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-[var(--bg-card)] shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto max-w-2xl px-6 pb-8 pt-5">
              {/* Handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />

              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {editingProduct ? t.edit : t.addProduct}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Row 1: Name + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{t.name}</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{t.category}</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {ldaProductCategories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Price + Barcode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{t.price} ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">{t.barcode}</label>
                    <input
                      type="text"
                      value={formBarcode}
                      onChange={(e) => setFormBarcode(e.target.value)}
                      className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Row 3: Cost + Reorder Point */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">Cost Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct ? (editingProduct.price * 0.4).toFixed(2) : ''}
                      className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-muted)]">Reorder Point</label>
                    <input
                      type="number"
                      defaultValue={editingProduct ? editingProduct.reorderLevel : ''}
                      className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  {/* Active Toggle */}
                  <label className="flex cursor-pointer items-center gap-2">
                    <span className="text-sm text-[var(--text-primary)]">{t.active}</span>
                    <button
                      type="button"
                      onClick={() => setActiveToggle(!activeToggle)}
                      className={cn(
                        'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors',
                        activeToggle ? 'bg-blue-600' : 'bg-slate-200'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                          activeToggle ? 'translate-x-4' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="secondary" size="md" onClick={() => setShowModal(false)}>
                    {t.cancel}
                  </Button>
                  <Button variant="primary" size="md" onClick={handleSave}>
                    {t.save}
                  </Button>
                </div>
              </div>
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
