import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/features/auth/auth.api";
import { getErrorMessage } from "@/lib/api";
import type {
  Transaction,
  TransactionFilters,
} from "@/features/transactions/transaction.schema";
import { getDefaultDateRange } from "@/features/transactions/utils/dateUtils";
import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { useTransactionsList } from "@/features/transactions/hooks/useTransactionsList";
import { useTransactionMutations } from "@/features/transactions/hooks/useTransactionMutations";
import {
  useTransactionCategories,
  useTransactionOverview,
} from "@/features/transactions/hooks/useTransactionData";
import {
  TransactionsContext,
  type TransactionsContextValue,
} from "./transactionsContextState";

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const userEmail = user?.email ?? "";

  const [filters, setFilters] =
    useState<TransactionFilters>(getDefaultDateRange);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState<"" | "INCOME" | "EXPENSE">("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mutationError, setError] = useState("");

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

  const error =
    mutationError ||
    (listIsError && listError
      ? getErrorMessage(listError, "Failed to load transactions")
      : "");

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

  const { createMutation, updateMutation, deleteMutation } =
    useTransactionMutations();

  const openAddDialog = useCallback(() => {
    setEditingTransaction(null);
    setEditDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditDialogOpen(true);
  }, []);

  const openDeleteDialog = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditingTransaction(null);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteId(null);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authAPI.logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const saveTransaction = useCallback(
    async ({
      transaction,
      data,
    }: {
      transaction: Transaction | null;
      data: {
        amount: number;
        type: "INCOME" | "EXPENSE";
        categoryName: string;
        description?: string;
        date: string;
      };
    }) => {
      try {
        if (transaction) {
          await updateMutation.mutateAsync({
            id: transaction.id,
            body: {
              amount: data.amount,
              type: data.type,
              categoryName: data.categoryName,
              description: data.description ?? null,
              date: data.date,
            },
          });
        } else {
          await createMutation.mutateAsync({
            amount: data.amount,
            type: data.type,
            categoryName: data.categoryName,
            description: data.description,
            date: data.date,
          });
        }
        closeEditDialog();
      } catch (err) {
        setError(getErrorMessage(err, "Failed to save transaction"));
        throw err;
      }
    },
    [createMutation, updateMutation, closeEditDialog],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      closeDeleteDialog();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete"));
    }
  }, [deleteId, deleteMutation, closeDeleteDialog]);

  const value = useMemo<TransactionsContextValue>(
    () => ({
      userEmail,
      transactions,
      isLoading,
      error,
      setError,
      overview,
      categories,
      filters,
      setFilters,
      filterCategory,
      setFilterCategory,
      filterType,
      setFilterType,
      openAddDialog,
      openEditDialog,
      openDeleteDialog,
      closeEditDialog,
      closeDeleteDialog,
      editDialogOpen,
      editingTransaction,
      deleteDialogOpen: !!deleteId,
      deleteId,
      handleLogout,
      refetchTransactions,
      saveTransaction,
      confirmDelete,
    }),
    [
      userEmail,
      transactions,
      isLoading,
      error,
      overview,
      categories,
      filters,
      filterCategory,
      filterType,
      editDialogOpen,
      editingTransaction,
      deleteId,
      openAddDialog,
      openEditDialog,
      openDeleteDialog,
      closeEditDialog,
      closeDeleteDialog,
      handleLogout,
      refetchTransactions,
      saveTransaction,
      confirmDelete,
    ],
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}
