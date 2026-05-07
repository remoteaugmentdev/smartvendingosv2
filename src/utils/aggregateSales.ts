import type { SalesRecord } from "@/data";

export interface MonthlySalesDatum {
  month: string;
  sales: number;
  commission: number;
  tax: number;
  cogs: number;
}

export function aggregateSalesByMonth(sales: SalesRecord[]): MonthlySalesDatum[] {
  return sales.map((r) => ({
    month: r.month,
    sales: r.sales,
    commission: r.commission,
    tax: r.tax,
    cogs: r.cogs,
  }));
}

export interface SalesByTypeDatum {
  category: string;
  sales: number;
  quantity: number;
}

export function aggregateSalesByType(sales: SalesRecord[]): SalesByTypeDatum[] {
  const totalSales = sales.reduce((s, r) => s + r.sales, 0);
  const totalQty = sales.reduce((s, r) => s + r.quantity, 0);
  return [
    { category: "Food", sales: Math.round(totalSales * 0.55), quantity: Math.round(totalQty * 0.58) },
    { category: "Beverage", sales: Math.round(totalSales * 0.45), quantity: Math.round(totalQty * 0.42) },
  ];
}
