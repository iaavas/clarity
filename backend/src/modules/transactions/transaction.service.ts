import prisma from "../../config/db";
import { Prisma } from "../../../generated/prisma/client";
import { TransactionFilters } from "./transaction.types";
import { CreateTransactionInput } from "./transaction.schema";
import { parseDate } from "../../utils/date.utils";

export const findAllTransactions = async (filters: TransactionFilters) => {
  const { userId, categoryId, type, startDate, endDate } = filters;
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return prisma.transaction.findMany({
    where: {
      userId,
      ...(categoryId && { categoryId }),
      ...(type && { type }),
      ...((start || end) && {
        date: {
          ...(start && { gte: start }),
          ...(end && { lte: end }),
        },
      }),
    },
    include: { category: true },
    orderBy: { date: "desc" },
  });
};

export const createNewTransaction = async (data: CreateTransactionInput) => {
  const { amount, type, description, date, categoryName, userId } = data;
  const decimalAmount = new Prisma.Decimal(amount);

  const category = await prisma.category.upsert({
    where: { name_userId: { name: categoryName, userId } },
    update: {},
    create: { name: categoryName, user: { connect: { id: userId } } },
  });

  return prisma.transaction.create({
    data: {
      amount: decimalAmount,
      type,
      description,
      date: parseDate(date) ?? new Date(),
      categoryId: category.id,
      userId,
    },
    include: { category: true },
  });
};
