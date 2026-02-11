import { useQuery } from "@tanstack/react-query";
import { transactionsAPI } from "@/features/transactions/transactions.api";
import type { TransactionFilters } from "@/features/transactions/transaction.schema";

interface UseTransactionDataParams {
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
}: UseTransactionDataParams) {
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

export function useTransactionCategories({
  filters,
  categoryId,
  type,
  enabled,
}: UseTransactionDataParams) {
  return useQuery({
    queryKey: [
      "transaction-categories",
      filters.startDate,
      filters.endDate,
      categoryId,
      type,
    ],
    queryFn: () =>
      transactionsAPI.getCategories({
        ...filters,
        ...(categoryId && categoryId !== "all" && { categoryId }),
        ...(type && { type }),
      }),
    enabled,
    select: (data) => data || [],
  });
}

export function useTransactionOverview({
  filters,
  categoryId,
  type,
  enabled,
}: UseTransactionDataParams) {
  return useQuery({
    queryKey: [
      "transaction-overview",
      filters.startDate,
      filters.endDate,
      categoryId,
      type,
    ],
    queryFn: () =>
      transactionsAPI.getOverview({
        ...filters,
        ...(categoryId && categoryId !== "all" && { categoryId }),
        ...(type && { type }),
      }),
    enabled,
    select: (data) => data || { income: 0, expense: 0, balance: 0 },
  });
}

export function useMonthlyFinancials({
  filters,
  categoryId,
  type,
  enabled,
}: UseTransactionDataParams) {
  return useQuery({
    queryKey: [
      "monthly-financials",
      filters.startDate,
      filters.endDate,
      categoryId,
      type,
    ],
    queryFn: () =>
      transactionsAPI.getMonthlyFinancials({
        ...filters,
        ...(categoryId && categoryId !== "all" && { categoryId }),
        ...(type && { type }),
      }),
    enabled,
    select: (data) => data || [],
  });
}

export function useCategoryExpenses({
  filters,
  categoryId,
  enabled,
}: Omit<UseTransactionDataParams, "type">) {
  return useQuery({
    queryKey: [
      "category-expenses",
      filters.startDate,
      filters.endDate,
      categoryId,
    ],
    queryFn: () =>
      transactionsAPI.getCategoryExpenses({
        ...filters,
        ...(categoryId && categoryId !== "all" && { categoryId }),
      }),
    enabled,
    select: (data) => data || [],
  });
}
