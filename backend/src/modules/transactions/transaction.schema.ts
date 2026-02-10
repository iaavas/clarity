import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryName: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(),
  userId: z.uuid(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
