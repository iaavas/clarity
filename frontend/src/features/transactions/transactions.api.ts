import api from "@/lib/api";
import type { Transaction, TransactionFilters } from "./transaction.schema";

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export const transactionsAPI = {
  list: async (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    const response = await api.get<ApiResponse<Transaction[]>>(
      `/transactions?${params.toString()}`
    );
    return response.data.data;
  },

  create: async (body: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryName: string;
    description?: string;
    date?: string;
  }) => {
    const response = await api.post<ApiResponse<Transaction>>(
      "/transactions",
      body
    );
    return response.data.data;
  },

  update: async (
    id: string,
    body: {
      amount?: number;
      type?: "INCOME" | "EXPENSE";
      categoryName?: string;
      description?: string | null;
      date?: string;
    }
  ) => {
    const response = await api.patch<ApiResponse<Transaction>>(
      `/transactions/${id}`,
      body
    );
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/transactions/${id}`);
  },
};
