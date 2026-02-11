import { useMemo } from "react";
import { getErrorMessage } from "@/lib/api";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import {
  useTransactionsList,
  useTransactionCategories,
  useTransactionOverview,
} from "@/features/transactions/hooks/useTransactionData";
import { useDataStore } from "@/features/transactions/store/dataStore";
import { useUIStore } from "@/features/transactions/store/uiStore";

export function useTransactions() {
  const { data: user } = useCurrentUser();
  const userEmail = user?.email ?? "";

  const filters = useDataStore((state) => state.filters);
  const filterCategory = useDataStore((state) => state.filterCategory);
  const filterType = useDataStore((state) => state.filterType);

  const mutationError = useUIStore((state) => state.mutationError);

  const transactionsList = useTransactionsList({
    filters,
    categoryId: filterCategory,
    type: filterType,
    enabled: !!userEmail,
  });

  const {
    data: transactions = [],
    isLoading,
    isError: listIsError,
    error: listError,
    refetch: refetchTransactions,
  } = transactionsList;

  const categoriesQuery = useTransactionCategories({
    filters,
    categoryId: filterCategory,
    type: filterType,
    enabled: !!userEmail,
  });

  const overviewQuery = useTransactionOverview({
    filters,
    categoryId: filterCategory,
    type: filterType,
    enabled: !!userEmail,
  });

  const categories = useMemo(
    () => categoriesQuery.data || [],
    [categoriesQuery.data],
  );

  const overview = useMemo(
    () => overviewQuery.data || { income: 0, expense: 0, balance: 0 },
    [overviewQuery.data],
  );

  const error =
    mutationError ||
    (listIsError && listError
      ? getErrorMessage(listError, "Failed to load transactions")
      : "");

  return {
    userEmail,
    transactions,
    isLoading,
    error,
    overview,
    categories,
    refetchTransactions,
  };
}
