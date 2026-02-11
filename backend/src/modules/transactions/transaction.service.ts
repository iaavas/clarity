import prisma from "../../config/db";
import { Prisma } from "../../../generated/prisma/client";
import { TransactionFilters } from "./transaction.types";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "./transaction.schema";
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

export const updateTransactionById = async (
  id: string,
  userId: string,
  data: UpdateTransactionInput,
) => {
  const existing = await prisma.transaction.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;

  const { amount, type, description, date, categoryName } = data;
  let categoryId = existing.categoryId;
  if (categoryName) {
    const category = await prisma.category.upsert({
      where: { name_userId: { name: categoryName, userId } },
      update: {},
      create: { name: categoryName, user: { connect: { id: userId } } },
    });
    categoryId = category.id;
  }

  return prisma.transaction.update({
    where: { id },
    data: {
      ...(amount !== undefined && { amount: new Prisma.Decimal(amount) }),
      ...(type && { type }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date: parseDate(date) ?? existing.date }),
      ...(categoryName && { categoryId }),
    },
    include: { category: true },
  });
};

export const deleteTransactionById = async (
  id: string,
  userId: string,
): Promise<boolean> => {
  const deleted = await prisma.transaction.deleteMany({
    where: { id, userId },
  });
  return deleted.count > 0;
};
