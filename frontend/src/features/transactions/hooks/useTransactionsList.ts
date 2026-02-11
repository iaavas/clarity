import { useQuery } from "@tanstack/react-query";
import { transactionsAPI } from "@/features/transactions/transactions.api";
import type { TransactionFilters } from "@/features/transactions/transaction.schema";

interface UseTransactionsListParams {
  filters: TransactionFilters;
  categoryId: string;
  type: "" | "INCOME" | "EXPENSE";
  enabled: boolean;
}

export function useTransactionsList({
  filters,
  categoryId,
  type,
  enabled,
}: UseTransactionsListParams) {
  return useQuery({
    queryKey: [
      "transactions",
      filters.startDate,
      filters.endDate,
      categoryId,
      type,
    ],
    queryFn: () =>
      transactionsAPI.list({
        ...filters,
        ...(categoryId && categoryId !== "all" && { categoryId }),
        ...(type && { type }),
      }),
    enabled,
  });
}
