export interface Product {
  id: string
  name: string
  category: 'food' | 'beverage'
  price: number
  stock: number
  reorderLevel: number
  totalSales: number
  totalQty: number
}

export const products: Product[] = [
  { id: 'p-001', name: "3 Musketeers", category: 'food', price: 1.75, stock: 12, reorderLevel: 20, totalSales: 51, totalQty: 51 },
  { id: 'p-002', name: "Mountain Dew 12oz", category: 'beverage', price: 1.50, stock: 8, reorderLevel: 20, totalSales: 35, totalQty: 46 },
  { id: 'p-003', name: "Coca Cola 12oz", category: 'beverage', price: 1.50, stock: 6, reorderLevel: 20, totalSales: 31, totalQty: 41 },
  { id: 'p-004', name: "Pepsi 12oz", category: 'beverage', price: 1.50, stock: 15, reorderLevel: 20, totalSales: 30, totalQty: 40 },
  { id: 'p-005', name: "Fritos Corn Chips", category: 'food', price: 1.50, stock: 18, reorderLevel: 20, totalSales: 27, totalQty: 43 },
  { id: 'p-006', name: "Doritos Nacho Cheese", category: 'food', price: 1.75, stock: 10, reorderLevel: 20, totalSales: 23, totalQty: 37 },
  { id: 'p-007', name: "Wrigley's Doublemint 5-stick", category: 'food', price: 1.25, stock: 22, reorderLevel: 20, totalSales: 16, totalQty: 35 },
  { id: 'p-008', name: "Snickers Bar", category: 'food', price: 1.75, stock: 25, reorderLevel: 15, totalSales: 42, totalQty: 42 },
  { id: 'p-009', name: "Kit Kat Bar", category: 'food', price: 1.75, stock: 20, reorderLevel: 15, totalSales: 38, totalQty: 38 },
  { id: 'p-010', name: "Sprite 12oz", category: 'beverage', price: 1.50, stock: 14, reorderLevel: 20, totalSales: 28, totalQty: 36 },
  { id: 'p-011', name: "Dr Pepper 12oz", category: 'beverage', price: 1.50, stock: 11, reorderLevel: 20, totalSales: 25, totalQty: 32 },
  { id: 'p-012', name: "Cheez-It Crackers", category: 'food', price: 1.50, stock: 16, reorderLevel: 15, totalSales: 21, totalQty: 29 },
  { id: 'p-013', name: "Lay's Classic Chips", category: 'food', price: 1.50, stock: 9, reorderLevel: 15, totalSales: 34, totalQty: 34 },
  { id: 'p-014', name: "Nature Valley Granola Bar", category: 'food', price: 1.75, stock: 28, reorderLevel: 12, totalSales: 18, totalQty: 18 },
  { id: 'p-015', name: "Reese's Peanut Butter Cups", category: 'food', price: 1.75, stock: 19, reorderLevel: 15, totalSales: 29, totalQty: 29 },
  { id: 'p-016', name: "Gatorade Fruit Punch", category: 'beverage', price: 2.00, stock: 13, reorderLevel: 18, totalSales: 22, totalQty: 22 },
  { id: 'p-017', name: "Poland Spring Water", category: 'beverage', price: 1.25, stock: 30, reorderLevel: 25, totalSales: 45, totalQty: 45 },
  { id: 'p-018', name: "Red Bull Energy", category: 'beverage', price: 2.50, stock: 7, reorderLevel: 12, totalSales: 19, totalQty: 19 },
  { id: 'p-019', name: "Pringles Original", category: 'food', price: 1.75, stock: 17, reorderLevel: 12, totalSales: 24, totalQty: 24 },
  { id: 'p-020', name: "M&M's Peanut", category: 'food', price: 1.75, stock: 21, reorderLevel: 15, totalSales: 31, totalQty: 31 },
  { id: 'p-021', name: "Twix Bar", category: 'food', price: 1.75, stock: 24, reorderLevel: 15, totalSales: 26, totalQty: 26 },
  { id: 'p-022', name: "Starbucks Mocha Frappuccino", category: 'beverage', price: 3.00, stock: 5, reorderLevel: 10, totalSales: 14, totalQty: 14 },
  { id: 'p-023', name: "Sun Chips Garden Salsa", category: 'food', price: 1.50, stock: 23, reorderLevel: 12, totalSales: 17, totalQty: 17 },
  { id: 'p-024', name: "Cliff Bar Chocolate Chip", category: 'food', price: 2.25, stock: 26, reorderLevel: 10, totalSales: 11, totalQty: 11 },
  { id: 'p-025', name: "Pop-Tarts Strawberry", category: 'food', price: 1.50, stock: 15, reorderLevel: 12, totalSales: 20, totalQty: 20 },
  { id: 'p-026', name: "Arizona Green Tea", category: 'beverage', price: 1.50, stock: 10, reorderLevel: 15, totalSales: 23, totalQty: 23 },
  { id: 'p-027', name: "Welch's Fruit Snacks", category: 'food', price: 1.25, stock: 32, reorderLevel: 15, totalSales: 13, totalQty: 13 },
  { id: 'p-028', name: "Minute Maid OJ", category: 'beverage', price: 1.75, stock: 12, reorderLevel: 15, totalSales: 16, totalQty: 16 },
  { id: 'p-029', name: "Goldfish Crackers", category: 'food', price: 1.50, stock: 27, reorderLevel: 12, totalSales: 15, totalQty: 15 },
  { id: 'p-030', name: "Hershey's Milk Chocolate", category: 'food', price: 1.75, stock: 20, reorderLevel: 15, totalSales: 22, totalQty: 22 },
]
