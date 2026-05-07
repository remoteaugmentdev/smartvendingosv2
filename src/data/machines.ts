export interface Machine {
  id: string
  name: string
  locationId: string
  status: 'active' | 'offline' | 'needs_service'
  lastServiced: string
  totalSales: number
  monthlySales: number[]
}

export const machines: Machine[] = [
  {
    id: 'M-001',
    name: 'City Hall A',
    locationId: 'loc-1',
    status: 'active',
    lastServiced: '2026-04-15',
    totalSales: 9800,
    monthlySales: [1400, 800, 1100, 1300, 1250, 1500],
  },
  {
    id: 'M-002',
    name: 'City Hall B',
    locationId: 'loc-1',
    status: 'active',
    lastServiced: '2026-04-15',
    totalSales: 8600,
    monthlySales: [1200, 700, 980, 1100, 1150, 1300],
  },
  {
    id: 'M-003',
    name: 'Central Park',
    locationId: 'loc-2',
    status: 'needs_service',
    lastServiced: '2026-03-10',
    totalSales: 9200,
    monthlySales: [1500, 900, 1200, 1400, 1300, 1600],
  },
  {
    id: 'M-004',
    name: 'Hospital Lobby',
    locationId: 'loc-3',
    status: 'active',
    lastServiced: '2026-04-20',
    totalSales: 10400,
    monthlySales: [1600, 950, 1300, 1500, 1450, 1700],
  },
  {
    id: 'M-005',
    name: 'Hospital Wing 2',
    locationId: 'loc-3',
    status: 'active',
    lastServiced: '2026-04-18',
    totalSales: 9600,
    monthlySales: [1500, 850, 1200, 1400, 1350, 1600],
  },
  {
    id: 'M-006',
    name: 'Hospital Cafeteria',
    locationId: 'loc-3',
    status: 'offline',
    lastServiced: '2026-02-28',
    totalSales: 7600,
    monthlySales: [1200, 600, 900, 1100, 1050, 1200],
  },
  {
    id: 'M-007',
    name: 'Mall Food Court',
    locationId: 'loc-4',
    status: 'active',
    lastServiced: '2026-04-22',
    totalSales: 9200,
    monthlySales: [1400, 800, 1100, 1300, 1250, 1500],
  },
  {
    id: 'M-008',
    name: 'Mall Entrance',
    locationId: 'loc-4',
    status: 'needs_service',
    lastServiced: '2026-03-05',
    totalSales: 7600,
    monthlySales: [1100, 700, 900, 1100, 1050, 1250],
  },
  {
    id: 'M-009',
    name: 'University Commons',
    locationId: 'loc-5',
    status: 'active',
    lastServiced: '2026-04-25',
    totalSales: 8400,
    monthlySales: [1300, 750, 1050, 1250, 1200, 1400],
  },
  {
    id: 'M-010',
    name: 'Airport Terminal B',
    locationId: 'loc-6',
    status: 'active',
    lastServiced: '2026-04-28',
    totalSales: 11200,
    monthlySales: [1700, 1000, 1400, 1600, 1550, 1800],
  },
  {
    id: 'M-011',
    name: 'Tech Park Lobby',
    locationId: 'loc-7',
    status: 'active',
    lastServiced: '2026-04-10',
    totalSales: 7600,
    monthlySales: [1100, 650, 900, 1100, 1050, 1250],
  },
  {
    id: 'M-012',
    name: 'Transit Hub Main',
    locationId: 'loc-8',
    status: 'active',
    lastServiced: '2026-04-30',
    totalSales: 9400,
    monthlySales: [1400, 850, 1150, 1350, 1300, 1500],
  },
]
