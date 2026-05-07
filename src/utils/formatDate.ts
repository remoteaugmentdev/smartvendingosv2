import { format, parseISO } from "date-fns";

export function formatDate(dateStr: string, pattern = "MMM d, yyyy"): string {
  return format(parseISO(dateStr), pattern);
}

export function formatMonth(dateStr: string): string {
  return format(parseISO(dateStr), "MMM yyyy");
}
