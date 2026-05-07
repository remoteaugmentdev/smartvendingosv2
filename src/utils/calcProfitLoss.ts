import type { SalesRecord, ExpenseRecord } from "@/data";

export interface ProfitLossSummary {
  grossSales: number;
  commissions: number;
  cogs: number;
  expenses: number;
  netIncome: number;
}

export function calcProfitLoss(
  sales: SalesRecord[],
  expenses: ExpenseRecord[]
): ProfitLossSummary {
  const grossSales = sales.reduce((sum, r) => sum + r.sales, 0);
  const commissions = sales.reduce((sum, r) => sum + r.commission, 0);
  const cogs = sales.reduce((sum, r) => sum + r.cogs, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = grossSales - commissions - cogs - totalExpenses;

  return {
    grossSales: Math.round(grossSales),
    commissions: Math.round(commissions),
    cogs: Math.round(cogs),
    expenses: Math.round(totalExpenses),
    netIncome: Math.round(netIncome),
  };
}

export interface CashFlowSummary {
  cashCollected: number;
  commissions: number;
  purchases: number;
  expenses: number;
  netCashFlow: number;
}

export function calcCashFlow(
  sales: SalesRecord[],
  expenses: ExpenseRecord[]
): CashFlowSummary {
  const cashCollected = sales.reduce((sum, r) => sum + r.sales, 0);
  const commissions = sales.reduce((sum, r) => sum + r.commission, 0);
  const purchases = sales.reduce((sum, r) => sum + r.cogs, 0) + 109;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netCashFlow = cashCollected - commissions - purchases - totalExpenses;

  return {
    cashCollected: Math.round(cashCollected),
    commissions: Math.round(commissions),
    purchases: Math.round(purchases),
    expenses: Math.round(totalExpenses),
    netCashFlow: Math.round(netCashFlow),
  };
}
