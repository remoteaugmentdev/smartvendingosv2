export interface SalesRecord {
  month: string
  sales: number
  commission: number
  tax: number
  cogs: number
  quantity: number
}

export const sales: SalesRecord[] = [
  { month: 'Apr', sales: 172, commission: 14, tax: 8, cogs: 95, quantity: 110 },
  { month: 'May', sales: 90,  commission: 8,  tax: 4, cogs: 50, quantity: 58 },
  { month: 'Jun', sales: 140, commission: 12, tax: 6, cogs: 75, quantity: 89 },
  { month: 'Jul', sales: 160, commission: 13, tax: 7, cogs: 85, quantity: 102 },
  { month: 'Aug', sales: 155, commission: 12, tax: 7, cogs: 80, quantity: 99 },
  { month: 'Sep', sales: 180, commission: 15, tax: 8, cogs: 95, quantity: 115 },
]
