import { createContext } from "react";
import type {
  Transaction,
  TransactionFilters,
} from "@/features/transactions/transaction.schema";

export interface TransactionsContextValue {
  userEmail: string;
  transactions: Transaction[];
  isLoading: boolean;
  error: string;
  setError: (msg: string) => void;
  overview: { income: number; expense: number; balance: number };
  categories: { id: string; name: string }[];
  filters: TransactionFilters;
  setFilters: (f: TransactionFilters) => void;
  filterCategory: string;
  setFilterCategory: (c: string) => void;
  filterType: "" | "INCOME" | "EXPENSE";
  setFilterType: (t: "" | "INCOME" | "EXPENSE") => void;
  openAddDialog: () => void;
  openEditDialog: (transaction: Transaction) => void;
  openDeleteDialog: (id: string) => void;
  closeEditDialog: () => void;
  closeDeleteDialog: () => void;
  editDialogOpen: boolean;
  editingTransaction: Transaction | null;
  deleteDialogOpen: boolean;
  deleteId: string | null;
  handleLogout: () => void;
  refetchTransactions: () => Promise<unknown>;
  saveTransaction: (params: {
    transaction: Transaction | null;
    data: {
      amount: number;
      type: "INCOME" | "EXPENSE";
      categoryName: string;
      description?: string;
      date: string;
    };
  }) => Promise<void>;
  confirmDelete: () => Promise<void>;
}

export const TransactionsContext =
  createContext<TransactionsContextValue | null>(null);
