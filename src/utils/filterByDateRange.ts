import { parseISO, isWithinInterval } from "date-fns";

export function filterByDateRange<T extends { date: string }>(
  records: T[],
  startDate: Date | null,
  endDate: Date | null
): T[] {
  if (!startDate && !endDate) return records;
  return records.filter((r) => {
    const d = parseISO(r.date);
    if (startDate && endDate) {
      return isWithinInterval(d, { start: startDate, end: endDate });
    }
    if (startDate) return d >= startDate;
    if (endDate) return d <= endDate;
    return true;
  });
}
