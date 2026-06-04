'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/layout/PageHeader'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { cn } from '@/utils/cn'
import { Plus } from 'lucide-react'

type Section = {
  key: string
  label: string
  addLabel: string
  columns: string[]
  rows: string[][]
}

const SECTIONS: Section[] = [
  { key: 'product-types', label: 'Product Types', addLabel: 'Create Product Type', columns: ['Name', 'Products'],
    rows: [['Beverage', '18'], ['Snack', '22'], ['Food', '5'], ['Hot Drink', '2'], ['Ingredient', '1'], ['Health & Beauty', '0']] },
  { key: 'tags', label: 'Tag Types', addLabel: 'Create Tag', columns: ['Tag', 'Color', 'Products'],
    rows: [['New', 'Blue', '6'], ['Vegan', 'Green', '4'], ['Gluten-Free', 'Amber', '3'], ['Best Seller', 'Red', '9'], ['Clearance', 'Slate', '2']] },
  { key: 'suppliers', label: 'Suppliers', addLabel: 'Add Supplier', columns: ['Supplier', 'Contact', 'Phone', 'Products', 'Last Order'],
    rows: [['Walmart Supercenter', 'B. Carter', '(555) 201-3300', '24', 'Apr 28'], ["Norman Sam's Club", 'L. Ortiz', '(555) 778-1100', '12', 'May 2'], ['McLane Foodservice', 'D. Reed', '(555) 940-5520', '31', 'May 6']] },
  { key: 'variety-packs', label: 'Variety Packs', addLabel: 'Create Variety Pack', columns: ['Pack Name', 'Included Products', 'Price'],
    rows: [['Office Combo', '3 Musketeers + Coca-Cola', '$2.50'], ['Energy Boost', 'Red Bull + Nature Valley Bar', '$4.75']] },
  { key: 'custom-fields', label: 'Custom Fields', addLabel: 'Add Custom Field', columns: ['Field Name', 'Applies To', 'Type', 'Required'],
    rows: [['Asset Tag', 'Machine', 'Text', 'Yes'], ['Lease End', 'Location', 'Date', 'No'], ['Hazard Class', 'Product', 'Text', 'No']] },
  { key: 'vehicles', label: 'Vehicles / Trucks', addLabel: 'Create Truck', columns: ['Vehicle', 'License Plate', 'Model', 'Driver', 'Status'],
    rows: [['Van 1', 'OK-4821', 'Ford Transit 2023', 'John Martinez', 'Active'], ['Van 2', 'OK-7740', 'RAM ProMaster 2022', 'Maria Chen', 'Active'], ['Van 3', 'OK-9015', 'Chevy Express 2021', 'Bob Williams', 'Maintenance']] },
  { key: 'warehouses', label: 'Warehouses', addLabel: 'Add Warehouse', columns: ['Warehouse', 'Address', 'Total Units'],
    rows: [['Main Warehouse', 'OKC Distribution Center', '624'], ['Van Stock (Route A)', "John's Van", '142']] },
  { key: 'column-maps', label: 'Column Maps', addLabel: 'Add Column Map', columns: ['Import Profile', 'Mapped Fields', 'Source'],
    rows: [['Catalog Import v1', '8 / 8', 'Excel'], ['Inventory Sync', '5 / 6', 'CSV']] },
  { key: 'telemetry', label: 'Telemetry', addLabel: 'Connect Provider', columns: ['Provider', 'Status', 'Connected Machines', 'Last Sync'],
    rows: [['Micron API', 'Connected', '24', '2 min ago'], ['Nayax', 'Not connected', '0', '—']] },
  { key: 'common-problems', label: 'Common Problems', addLabel: 'Add Problem', columns: ['Problem', 'Category', 'Default Priority'],
    rows: [['Motor Jam', 'Hardware', 'High'], ['Screen Not Working', 'Hardware', 'Medium'], ['Card Reader Failure', 'Hardware', 'High'], ['Machine Offline', 'Software', 'Critical'], ["Door Won't Close", 'Hardware', 'Medium'], ['Low Temperature Alert', 'Inventory', 'High']] },
]

export default function ConfigurationPage() {
  const [active, setActive] = useState(SECTIONS[0].key)
  const section = SECTIONS.find((s) => s.key === active)!

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Configuration" description="Manage catalog metadata, suppliers, fleet, and integrations" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sub-nav */}
        <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={cn(
                'rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                active === s.key ? 'bg-blue-600 text-white' : 'text-[var(--text-muted)] hover:bg-slate-100'
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--text-primary)]">{section.label}</h3>
            <Button size="sm"><Plus size={16} /> {section.addLabel}</Button>
          </div>
          <Table>
            <Thead>
              <Tr>
                {section.columns.map((c) => <Th key={c}>{c}</Th>)}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {section.rows.map((row, i) => (
                <Tr key={i}>
                  {row.map((cell, j) => (
                    <Td key={j} className={j === 0 ? 'font-medium' : 'text-[var(--text-muted)]'}>{cell}</Td>
                  ))}
                  <Td>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">Edit</button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
