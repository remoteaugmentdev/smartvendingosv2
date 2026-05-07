export interface Location {
  id: string
  name: string
  address: string
  machineCount: number
  totalSales: number
}

export const locations: Location[] = [
  { id: 'loc-1', name: 'City Hall', address: '100 Main St, Springfield', machineCount: 2, totalSales: 18400 },
  { id: 'loc-2', name: 'Central Park East', address: '250 Park Ave, Springfield', machineCount: 1, totalSales: 9200 },
  { id: 'loc-3', name: 'Riverside Hospital', address: '500 River Rd, Springfield', machineCount: 3, totalSales: 27600 },
  { id: 'loc-4', name: 'Westfield Mall', address: '1200 West Blvd, Springfield', machineCount: 2, totalSales: 16800 },
  { id: 'loc-5', name: 'Springfield University', address: '1 University Dr, Springfield', machineCount: 1, totalSales: 8400 },
  { id: 'loc-6', name: 'Airport Terminal B', address: 'Terminal B, Springfield Airport', machineCount: 1, totalSales: 11200 },
  { id: 'loc-7', name: 'Tech Park Office', address: '800 Innovation Way, Springfield', machineCount: 1, totalSales: 7600 },
  { id: 'loc-8', name: 'Downtown Transit Hub', address: '50 Transit Plaza, Springfield', machineCount: 1, totalSales: 9400 },
]
