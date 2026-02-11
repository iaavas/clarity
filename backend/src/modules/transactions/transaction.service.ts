import prisma from "../../config/db";
import { Prisma } from "../../generated/prisma/client";
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

export const getTransactionOverview = async (filters: TransactionFilters) => {
  const { userId, categoryId, type, startDate, endDate } = filters;
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const transactions = await prisma.transaction.findMany({
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
    select: {
      amount: true,
      type: true,
    },
  });

  let income = 0;
  let expense = 0;

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);
    if (transaction.type === "INCOME") {
      income += amount;
    } else {
      expense += amount;
    }
  }

  return {
    income,
    expense,
    balance: income - expense,
  };
};

export const getMonthlyFinancials = async (filters: TransactionFilters) => {
  const { userId, categoryId, type, startDate, endDate } = filters;
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const transactions = await prisma.transaction.findMany({
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
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: "asc" },
  });

  const monthlyData = new Map<
    string,
    { month: string; income: number; expense: number }
  >();

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}`;
    const monthLabel = date.toLocaleString("default", { month: "short" });

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { month: monthLabel, income: 0, expense: 0 });
    }

    const entry = monthlyData.get(monthKey)!;
    const amount = Number(transaction.amount);

    if (transaction.type === "INCOME") {
      entry.income += amount;
    } else {
      entry.expense += amount;
    }
  }

  return Array.from(monthlyData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, data]) => data)
    .slice(-6);
};

export const getCategoryExpenses = async (filters: TransactionFilters) => {
  const { userId, categoryId, type, startDate, endDate } = filters;
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: "EXPENSE",
      ...(categoryId && { categoryId }),
      ...((start || end) && {
        date: {
          ...(start && { gte: start }),
          ...(end && { lte: end }),
        },
      }),
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const categoryMap = new Map<string, number>();

  for (const transaction of transactions) {
    const amount = Number(transaction.amount);
    const categoryName = transaction.category.name;
    const current = categoryMap.get(categoryName) || 0;
    categoryMap.set(categoryName, current + amount);
  }

  return Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

export const getTransactionCategories = async (filters: TransactionFilters) => {
  const { userId, categoryId, type, startDate, endDate } = filters;
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const transactions = await prisma.transaction.findMany({
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
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    distinct: ["categoryId"],
  });

  const categoryMap = new Map<string, string>();

  for (const transaction of transactions) {
    const categoryName = transaction.category.name;
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, transaction.category.id);
    }
  }

  return Array.from(categoryMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, id]) => ({ name, id }));
};
