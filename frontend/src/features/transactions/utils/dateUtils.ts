import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { type TransactionFilters } from "@/features/transactions/transaction.schema";

export function getDefaultDateRange(): TransactionFilters {
  const end = endOfMonth(new Date());
  const start = startOfMonth(subMonths(new Date(), 2));

  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(end, "yyyy-MM-dd"),
  };
}
