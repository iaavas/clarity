import { transactionsAPI } from "@/features/transactions/transactions.api";
import type { TransactionFilters } from "@/features/transactions/transaction.schema";

const createTransaction = async (args: Record<string, unknown>) => {
  const { amount, type, categoryName, description, date } = args as {
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryName: string;
    description?: string;
    date?: string;
  };
  try {
    const transaction = await transactionsAPI.create({
      amount,
      type,
      categoryName,
      description,
      date,
    });
    return {
      success: true,
      transaction,
      message: `Successfully created ${type.toLowerCase()} transaction of $${amount} in category "${categoryName}"`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create transaction",
    };
  }
};

const updateTransaction = async (args: Record<string, unknown>) => {
  const { id, amount, type, categoryName, description, date } = args as {
    id: string;
    amount?: number;
    type?: "INCOME" | "EXPENSE";
    categoryName?: string;
    description?: string | null;
    date?: string;
  };
  try {
    const transaction = await transactionsAPI.update(id, {
      amount,
      type,
      categoryName,
      description,
      date,
    });
    return {
      success: true,
      transaction,
      message: `Successfully updated transaction ${id}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update transaction",
    };
  }
};

const deleteTransaction = async (args: Record<string, unknown>) => {
  const { id } = args as { id: string };
  try {
    await transactionsAPI.delete(id);
    return {
      success: true,
      message: `Successfully deleted transaction ${id}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete transaction",
    };
  }
};

const getTransactions = async (args: Record<string, unknown>) => {
  const { categoryId, type, startDate, endDate } = args as {
    categoryId?: string;
    type?: "INCOME" | "EXPENSE";
    startDate?: string;
    endDate?: string;
  };
  try {
    const filters: TransactionFilters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (type) filters.type = type;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const transactions = await transactionsAPI.list(filters);
    return {
      success: true,
      transactions,
      count: transactions.length,
      message: `Found ${transactions.length} transaction(s)`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch transactions",
    };
  }
};

const getTransactionOverview = async (args: Record<string, unknown>) => {
  const { categoryId, type, startDate, endDate } = args as {
    categoryId?: string;
    type?: "INCOME" | "EXPENSE";
    startDate?: string;
    endDate?: string;
  };
  try {
    const filters: TransactionFilters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (type) filters.type = type;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const overview = await transactionsAPI.getOverview(filters);
    return {
      success: true,
      overview,
      message: `Income: $${overview.income}, Expenses: $${overview.expense}, Balance: $${overview.balance}`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch overview",
    };
  }
};

const getMonthlyFinancials = async (args: Record<string, unknown>) => {
  const { categoryId, type, startDate, endDate } = args as {
    categoryId?: string;
    type?: "INCOME" | "EXPENSE";
    startDate?: string;
    endDate?: string;
  };
  try {
    const filters: TransactionFilters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (type) filters.type = type;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const monthlyData = await transactionsAPI.getMonthlyFinancials(filters);
    return {
      success: true,
      monthlyFinancials: monthlyData,
      message: `Retrieved financial data for ${monthlyData.length} month(s)`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch monthly financials",
    };
  }
};

const getCategoryExpenses = async (args: Record<string, unknown>) => {
  const { categoryId, startDate, endDate } = args as {
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  };
  try {
    const filters: TransactionFilters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const categoryData = await transactionsAPI.getCategoryExpenses(filters);
    return {
      success: true,
      categoryExpenses: categoryData,
      message: `Retrieved expenses for ${categoryData.length} categor(ies)`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch category expenses",
    };
  }
};

const getCategories = async (args: Record<string, unknown>) => {
  const { categoryId, type, startDate, endDate } = args as {
    categoryId?: string;
    type?: "INCOME" | "EXPENSE";
    startDate?: string;
    endDate?: string;
  };
  try {
    const filters: TransactionFilters = {};
    if (categoryId) filters.categoryId = categoryId;
    if (type) filters.type = type;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const categories = await transactionsAPI.getCategories(filters);
    return {
      success: true,
      categories,
      message: `Found ${categories.length} categor(ies)`,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
};

export const transactionToolFunctions: Record<
  string,
  (args: Record<string, unknown>) => Promise<Record<string, unknown>>
> = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionOverview,
  getMonthlyFinancials,
  getCategoryExpenses,
  getCategories,
};
