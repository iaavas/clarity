import api from "@/lib/api";
import type { Transaction, TransactionFilters } from "./transaction.schema";

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface TransactionsAPI {
  list: (filters?: TransactionFilters) => Promise<Transaction[]>;
  create: (body: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryName: string;
    description?: string;
    date?: string;
  }) => Promise<Transaction>;
  update: (
    id: string,
    body: {
      amount?: number;
      type?: "INCOME" | "EXPENSE";
      categoryName?: string;
      description?: string | null;
      date?: string;
    }
  ) => Promise<Transaction>;
  delete: (id: string) => Promise<void>;
  getOverview: (filters?: TransactionFilters) => Promise<{ income: number; expense: number; balance: number }>;
  getMonthlyFinancials: (filters?: TransactionFilters) => Promise<{ month: string; income: number; expense: number }[]>;
  getCategoryExpenses: (filters?: TransactionFilters) => Promise<{ name: string; value: number }[]>;
  getCategories: (filters?: TransactionFilters) => Promise<{ name: string; id: string }[]>;
}

export const transactionsAPI: TransactionsAPI = {
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

  getOverview: async (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    const response = await api.get<ApiResponse<{ income: number; expense: number; balance: number }>>(
      `/transactions/overview?${params.toString()}`
    );
    return response.data.data;
  },

  getMonthlyFinancials: async (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    const response = await api.get<ApiResponse<{ month: string; income: number; expense: number }[]>>(
      `/transactions/monthly-financials?${params.toString()}`
    );
    return response.data.data;
  },

  getCategoryExpenses: async (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    const response = await api.get<ApiResponse<{ name: string; value: number }[]>>(
      `/transactions/category-expenses?${params.toString()}`
    );
    return response.data.data;
  },

  getCategories: async (filters?: TransactionFilters) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.set("categoryId", filters.categoryId);
    if (filters?.type) params.set("type", filters.type);
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    const response = await api.get<ApiResponse<{ name: string; id: string }[]>>(
      `/transactions/categories?${params.toString()}`
    );
    return response.data.data;
  },
};
