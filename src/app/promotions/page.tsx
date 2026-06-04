'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { cn } from '@/utils/cn'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

const campaigns: {
  name: string; status: 'Active' | 'Scheduled' | 'Ended'; type: string
  machines: number; discount: string; window: string; redemptions: number; impact: number
}[] = [
  { name: 'Summer Soda Splash', status: 'Active', type: 'Percentage Discount', machines: 5, discount: '20% off', window: 'Jun 1 – Jun 30', redemptions: 47, impact: 340 },
  { name: 'Afternoon Flash Sale', status: 'Active', type: 'Time-Based Flash Sale', machines: 8, discount: '$1.00 any item · 2–4 PM', window: 'Daily', redemptions: 31, impact: 210 },
  { name: 'Snack + Drink Bundle', status: 'Scheduled', type: 'Bundle Deal', machines: 3, discount: '$2.50 bundle', window: 'Jul 1 – Jul 15', redemptions: 0, impact: 0 },
]

const rewards = [
  { name: 'Free Drink', points: 150, value: 1.25, redeemed: 42, active: true },
  { name: '10% Off Next Purchase', points: 100, value: 0.5, redeemed: 88, active: true },
  { name: 'Free Snack', points: 120, value: 1.5, redeemed: 35, active: true },
  { name: 'Enter Prize Draw', points: 50, value: 0, redeemed: 124, active: true },
]

const STATUS_VARIANT = { Active: 'success', Scheduled: 'info', Ended: 'default' } as const

export default function PromotionsPage() {
  const [tab, setTab] = useState<'campaigns' | 'loyalty'>('campaigns')

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Promotions & Loyalty" description="Campaigns engine + customer loyalty program">
        <Button size="sm">
          <Plus size={16} /> {tab === 'campaigns' ? 'Create Campaign' : 'Add Reward'}
        </Button>
      </PageHeader>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Campaigns', value: '2' },
          { label: 'Loyalty Members', value: '1,247' },
          { label: 'Redemptions This Month', value: '89' },
          { label: 'Revenue from Promotions', value: '+' + formatCurrency(2340) },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {(['campaigns', 'loyalty'] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2 capitalize',
              tab === tb ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {tb === 'campaigns' ? 'Campaigns' : 'Loyalty Program'}
          </button>
        ))}
      </div>

      {tab === 'campaigns' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => (
            <Card key={c.name}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{c.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{c.type}</p>
                </div>
                <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge>
              </div>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Discount</dt><dd className="font-medium">{c.discount}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Machines</dt><dd className="font-medium">{c.machines}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Window</dt><dd className="font-medium">{c.window}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Redemptions</dt><dd className="font-medium">{c.redemptions}</dd></div>
                <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Revenue impact</dt><dd className="font-medium text-emerald-600">+{formatCurrency(c.impact)}</dd></div>
              </dl>
            </Card>
          ))}
        </div>
      )}

      {tab === 'loyalty' && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>SmartPoints Program</CardTitle><Badge variant="success">Active</Badge></CardHeader>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-sm">
              <div><p className="text-[var(--text-muted)]">Members</p><p className="text-lg font-bold">1,247</p></div>
              <div><p className="text-[var(--text-muted)]">Points value</p><p className="text-lg font-bold">1 pt = $0.01</p></div>
              <div><p className="text-[var(--text-muted)]">Earn rate</p><p className="text-lg font-bold">1 pt / $1</p></div>
              <div><p className="text-[var(--text-muted)]">Redemptions (mo)</p><p className="text-lg font-bold">89</p></div>
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Rewards</CardTitle></CardHeader>
            <Table>
              <Thead>
                <Tr>
                  <Th>Reward</Th>
                  <Th>Points Required</Th>
                  <Th>Value</Th>
                  <Th>Times Redeemed</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rewards.map((r) => (
                  <Tr key={r.name}>
                    <Td className="font-medium">{r.name}</Td>
                    <Td>{r.points} pts</Td>
                    <Td>{r.value ? formatCurrency(r.value, 2) : '—'}</Td>
                    <Td>{r.redeemed}</Td>
                    <Td><Badge variant="success">Active</Badge></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>

          <Card>
            <CardHeader><CardTitle>How it works</CardTitle></CardHeader>
            <p className="text-sm text-[var(--text-muted)]">
              Customers scan a QR code at the machine after purchase → they earn points → they redeem at the kiosk on
              their next visit. No app download required — web-based loyalty.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
