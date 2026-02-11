import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryName: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(),
  userId: z.uuid(),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryName: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  date: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
