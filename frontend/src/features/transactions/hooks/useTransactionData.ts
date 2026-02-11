import { useMemo } from "react";
import { type Transaction } from "@/features/transactions/transaction.schema";

export function useTransactionCategories(transactions: Transaction[]) {
  return useMemo(() => {
    const categoryMap = new Map<string, string>();

    for (const transaction of transactions) {
      if (!categoryMap.has(transaction.category.name)) {
        categoryMap.set(transaction.category.name, transaction.category.id);
      }
    }

    return Array.from(categoryMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, id]) => ({ name, id }));
  }, [transactions]);
}

export function useTransactionOverview(transactions: Transaction[]) {
  return useMemo(() => {
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
  }, [transactions]);
}
