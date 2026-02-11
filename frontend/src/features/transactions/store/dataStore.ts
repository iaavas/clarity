import { create } from "zustand";
import type { TransactionFilters } from "@/features/transactions/transaction.schema";
import { getDefaultDateRange } from "@/features/transactions/utils/dateUtils";

interface DataStore {
  filters: TransactionFilters;
  filterCategory: string;
  filterType: "" | "INCOME" | "EXPENSE";

  setFilters: (filters: TransactionFilters) => void;
  setFilterCategory: (category: string) => void;
  setFilterType: (type: "" | "INCOME" | "EXPENSE") => void;
}

export const useDataStore = create<DataStore>((set) => ({
  filters: getDefaultDateRange(),
  filterCategory: "all",
  filterType: "",

  setFilters: (filters) => set({ filters }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterType: (type) => set({ filterType: type }),
}));
