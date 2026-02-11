import { Response } from "express";
import * as TransactionService from "./transaction.service";
import { sendError, sendSuccess } from "../../utils/apiResponse";
import { TransactionFilters } from "./transaction.types";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "./transaction.schema";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { z } from "zod";

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return sendError(res, "Authentication required", 401);
    }
    const { categoryId, type, startDate, endDate } = req.query;
    const transactions = await TransactionService.findAllTransactions({
      userId,
      ...(categoryId && { categoryId: categoryId as string }),
      ...(type && { type: type as "INCOME" | "EXPENSE" }),
      ...(startDate && { startDate: startDate as string }),
      ...(endDate && { endDate: endDate as string }),
    } as TransactionFilters);
    return sendSuccess(
      res,
      transactions,
      "Transactions fetched successfully",
      200,
    );
  } catch (error) {
    return sendError(res, "Failed to fetch transactions", 500);
  }
};

export const createTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return sendError(res, "Authentication required", 401);
    }
    const parsed = createTransactionSchema.safeParse({ ...req.body, userId });
    if (!parsed.success) {
      return sendError(
        res,
        z.prettifyError(parsed.error) || "Invalid transaction payload",
        422,
      );
    }

    const transaction = await TransactionService.createNewTransaction(
      parsed.data,
    );
    return sendSuccess(
      res,
      transaction,
      "Transaction created successfully",
      201,
    );
  } catch (error) {
    return sendError(res, "Check your transaction data", 400);
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return sendError(res, "Authentication required", 401);
    }
    const { id } = req.params as { id: string };
    const parsed = updateTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        res,
        z.prettifyError(parsed.error) || "Invalid update payload",
        422,
      );
    }
    const transaction = await TransactionService.updateTransactionById(
      id as string,
      userId,
      parsed.data,
    );
    if (!transaction) {
      return sendError(res, "Transaction not found", 404);
    }
    return sendSuccess(
      res,
      transaction,
      "Transaction updated successfully",
      200,
    );
  } catch (error) {
    return sendError(res, "Failed to update transaction", 400);
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return sendError(res, "Authentication required", 401);
    }
    const { id } = req.params as { id: string };
    const deleted = await TransactionService.deleteTransactionById(
      id as string,
      userId,
    );
    if (!deleted) {
      return sendError(res, "Transaction not found", 404);
    }
    return sendSuccess(res, null, "Transaction deleted successfully", 200);
  } catch (error) {
    return sendError(res, "Failed to delete transaction", 500);
  }
};
