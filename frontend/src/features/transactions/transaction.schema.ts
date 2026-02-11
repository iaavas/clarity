import z from "zod";

export const transactionFormSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryName: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

export type TransactionType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  amount: string;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: string;
  category: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
}
