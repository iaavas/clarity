import { TransactionType } from "../../../generated/prisma/client";

export type TransactionFilters = {
  userId: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
};
