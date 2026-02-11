import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { transactionsAPI } from "@/features/transactions/transactions.api";

export function useTransactionMutations() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const invalidateTransactions = () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["transaction-overview"] });
    queryClient.invalidateQueries({ queryKey: ["monthly-financials"] });
    queryClient.invalidateQueries({ queryKey: ["category-expenses"] });
    queryClient.invalidateQueries({ queryKey: ["transaction-categories"] });
  };

  const createMutation = useMutation({
    mutationFn: (body: {
      amount: number;
      type: "INCOME" | "EXPENSE";
      categoryName: string;
      description?: string;
      date?: string;
    }) => transactionsAPI.create(body),
    onSuccess: invalidateTransactions,
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: {
        amount?: number;
        type?: "INCOME" | "EXPENSE";
        categoryName?: string;
        description?: string | null;
        date?: string;
      };
    }) => transactionsAPI.update(id, body),
    onSuccess: invalidateTransactions,
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionsAPI.delete(id),
    onSuccess: invalidateTransactions,
    onError: (err) => {
      if (isAxiosError(err) && err.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
