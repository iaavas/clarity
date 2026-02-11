import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/features/auth/auth.api";
import { getErrorMessage } from "@/lib/api";
import type { Transaction } from "@/features/transactions/transaction.schema";
import { useTransactionMutations } from "@/features/transactions/hooks/useTransactionMutations";
import { useUIStore } from "@/features/transactions/store/uiStore";

export function useTransactionActions() {
  const navigate = useNavigate();
  const { createMutation, updateMutation, deleteMutation } =
    useTransactionMutations();

  const closeEditDialog = useUIStore((state) => state.closeEditDialog);
  const resetDialogStep = useUIStore((state) => state.resetDialogStep);
  const closeDeleteDialog = useUIStore((state) => state.closeDeleteDialog);
  const setError = useUIStore((state) => state.setError);
  const deleteId = useUIStore((state) => state.deleteId);

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
        resetDialogStep();
        closeEditDialog();
      } catch (err) {
        setError(getErrorMessage(err, "Failed to save transaction"));
        throw err;
      }
    },
    [
      createMutation,
      updateMutation,
      closeEditDialog,
      resetDialogStep,
      setError,
    ],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      closeDeleteDialog();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete"));
    }
  }, [deleteId, deleteMutation, closeDeleteDialog, setError]);

  const handleLogout = useCallback(async () => {
    try {
      await authAPI.logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return {
    saveTransaction,
    confirmDelete,
    handleLogout,
  };
}
