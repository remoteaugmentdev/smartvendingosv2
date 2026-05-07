// FILE: d:\smartvendkiosk\src\app\machines\[id]\page.tsx
'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Grid2x2,
  Tag,
  ShoppingBag,
  List,
  Wrench,
  ToggleLeft,
  CalendarClock,
  Hammer,
  Settings,
  ShoppingCart,
  Zap,
  PackageX,
  ClipboardList,
  Copy,
  Clock,
  RotateCcw,
  Coins,
  History,
  Route,
  SlidersHorizontal,
  Banknote,
  X,
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { ldaMachines } from '@/data/lda'
import { useTranslation } from '@/hooks/useTranslation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type LucideIcon = React.ComponentType<{ size?: number; className?: string }>

interface GridItem {
  label: string
  icon: LucideIcon
  href?: string
  action?: () => void
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-800 px-4 py-3 text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      {message}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Icon button used in both grids
// ---------------------------------------------------------------------------
function IconButton({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: LucideIcon
  label: string
  href?: string
  onClick?: () => void
}) {
  const inner = (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow text-white hover:from-teal-600 hover:to-blue-700 active:scale-95 transition-all cursor-pointer min-h-[72px] justify-center">
      <Icon size={20} />
      <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
    </div>
  )

  if (href) {
    return <Link href={href}>{inner}</Link>
  }
  return <button onClick={onClick} className="text-left">{inner}</button>
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function MachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslation()
  const machine = ldaMachines.find((m) => m.id === id)

  const [showDetail, setShowDetail] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  if (!machine) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-[var(--text-muted)]">Machine not found.</p>
        <Link href="/machines" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          ← Back to machines
        </Link>
      </div>
    )
  }

  const isOnline = machine.status === 'online'

  // ---- Goods Slot Settings ----
  const goodsItems: GridItem[] = [
    { label: t.machineCapacity, icon: Grid2x2, href: `/machines/${machine.id}/capacity` },
    { label: t.productPrice, icon: Tag, href: `/machines/${machine.id}/product-price` },
    { label: t.machineProduct, icon: ShoppingBag, href: `/machines/${machine.id}/machine-product` },
    { label: t.machineInventory, icon: List, href: `/machines/${machine.id}/inventory` },
    { label: t.motorTest, icon: Wrench, href: `/machines/${machine.id}/motor-test` },
    { label: t.switchGoodsSlot, icon: ToggleLeft, href: `/machines/${machine.id}/slot-switch` },
    { label: t.shelfLife, icon: CalendarClock, href: `/machines/${machine.id}/shelf-life` },
    { label: t.repairGoodsSlot, icon: Hammer, href: `/machines/${machine.id}/repair-slot` },
  ]

  // ---- Machine Operation & Maintenance ----
  const opsItems: GridItem[] = [
    { label: t.enterSetting, icon: Settings, href: `/machines/${machine.id}/settings` },
    { label: t.orderCenter, icon: ShoppingCart, href: `/machines/${machine.id}/orders` },
    { label: t.energy, icon: Zap, href: `/machines/${machine.id}/energy` },
    { label: t.inventoryShortage, icon: PackageX, href: `/inventory/shortage` },
    { label: t.inventoryDetail, icon: ClipboardList, href: `/machines/${machine.id}/inventory-detail` },
    { label: t.copyMachine, icon: Copy, href: `/machines/${machine.id}/copy` },
    { label: t.operationTime, icon: Clock, href: `/machines/${machine.id}/operation-time` },
    {
      label: t.machineRestart,
      icon: RotateCcw,
      action: () => setShowRestartConfirm(true),
    },
    { label: t.cashCoinRecord, icon: Coins, href: `/machines/${machine.id}/cash-record` },
    { label: t.operationRecord, icon: History, href: `/machines/${machine.id}/slot-operations` },
    { label: t.changeRoute, icon: Route, href: `/machines/${machine.id}/change-route` },
    { label: t.parameterConfig, icon: SlidersHorizontal, href: `/machines/${machine.id}/parameters` },
    { label: t.cashCoin, icon: Banknote, href: `/machines/${machine.id}/cash-summary` },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PageHeader title={machine.name} description={machine.location}>
        <Link href="/machines">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
      </PageHeader>

      {/* Header Card */}
      <Card className="mb-5">
        <CardHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isOnline ? 'success' : 'danger'}>
              {isOnline ? t.online : t.offline}
            </Badge>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{machine.id}</span>
            <span className="text-xs text-[var(--text-muted)]">· {machine.model}</span>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setShowDetail(true)}>
            {t.detail} &gt;
          </Button>
        </CardHeader>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Revenue Today</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              €{machine.revenueToday.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)]">Total Slots</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{machine.totalSlots}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)]">{t.inventory}</p>
            <p className="text-lg font-bold text-[var(--text-primary)]">{machine.inventory}</p>
          </div>
        </div>
      </Card>

      {/* Goods Slot Settings */}
      <section className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
          Goods Slot Settings
        </p>
        <div className="grid grid-cols-4 gap-2">
          {goodsItems.map((item) => (
            <IconButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              onClick={item.action}
            />
          ))}
        </div>
      </section>

      {/* Machine Operation & Maintenance */}
      <section className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
          Machine Operation &amp; Maintenance
        </p>
        <div className="grid grid-cols-3 gap-2">
          {opsItems.map((item) => (
            <IconButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              onClick={item.action}
            />
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {showDetail && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDetail(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
            <h3 className="mb-4 text-base font-bold text-slate-800">Machine {t.detail}</h3>
            <dl className="space-y-2 text-sm">
              {[
                ['Location', machine.location],
                ['Last Ping', new Date(machine.lastPing).toLocaleString()],
                ['Route', machine.route],
                ['Total Slots', String(machine.totalSlots)],
                ['Power Consumption', `${machine.powerConsumption} kWh`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-medium text-slate-800 text-right">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowDetail(false)}>
                {t.close}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Restart Confirm Modal */}
      {showRestartConfirm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
          onClick={() => setShowRestartConfirm(false)}
        >
          <div
            className="relative w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowRestartConfirm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
            <h3 className="mb-2 text-base font-bold text-slate-800">{t.machineRestart}?</h3>
            <p className="text-sm text-slate-500 mb-5">
              {t.restartConfirm}
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowRestartConfirm(false)}>
                {t.cancel}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setShowRestartConfirm(false)
                  setToastMsg(t.restartSent)
                }}
              >
                {t.confirm}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && <Toast message={toastMsg} onDone={() => setToastMsg('')} />}
    </div>
  )
}
