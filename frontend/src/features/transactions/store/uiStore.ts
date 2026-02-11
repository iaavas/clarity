import { create } from "zustand";
import type { Transaction } from "@/features/transactions/transaction.schema";

interface UIStore {
  editDialogOpen: boolean;
  editingTransaction: Transaction | null;
  deleteId: string | null;
  dialogStep: number;
  mutationError: string;

  openAddDialog: () => void;
  openEditDialog: (transaction: Transaction) => void;
  openDeleteDialog: (id: string) => void;
  closeEditDialog: () => void;
  closeDeleteDialog: () => void;
  nextDialogStep: () => void;
  prevDialogStep: () => void;
  resetDialogStep: () => void;
  setDialogStep: (step: number) => void;
  setError: (error: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  editDialogOpen: false,
  editingTransaction: null,
  deleteId: null,
  dialogStep: 1,
  mutationError: "",

  openAddDialog: () =>
    set({
      editingTransaction: null,
      dialogStep: 1,
      editDialogOpen: true,
      mutationError: "",
    }),

  openEditDialog: (transaction) =>
    set({
      editingTransaction: transaction,
      dialogStep: 1,
      editDialogOpen: true,
      mutationError: "",
    }),

  openDeleteDialog: (id) => set({ deleteId: id }),

  closeEditDialog: () =>
    set({
      editDialogOpen: false,
      editingTransaction: null,
      dialogStep: 1,
      mutationError: "",
    }),

  closeDeleteDialog: () => set({ deleteId: null }),

  nextDialogStep: () =>
    set((state) => ({ dialogStep: Math.min(state.dialogStep + 1, 3) })),

  prevDialogStep: () =>
    set((state) => ({ dialogStep: Math.max(state.dialogStep - 1, 1) })),

  resetDialogStep: () => set({ dialogStep: 1 }),

  setDialogStep: (step) => set({ dialogStep: step }),

  setError: (error) => set({ mutationError: error }),
}));
