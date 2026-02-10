import { RequestHandler } from "express";
import * as TransactionService from "./transaction.service";
import { sendError, sendSuccess } from "../../utils/apiResponse";
import { TransactionFilters } from "./transaction.types";
import { createTransactionSchema } from "./transaction.schema";
import { z } from "zod";
export const getTransactions: RequestHandler = async (req, res) => {
  try {
    const { userId, ...rest } = req.query;
    if (!userId || typeof userId !== "string") {
      return sendError(res, "userId is required", 400);
    }
    const transactions = await TransactionService.findAllTransactions({
      userId,
      ...rest,
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

export const createTransaction: RequestHandler = async (req, res) => {
  try {
    const parsed = createTransactionSchema.safeParse(req.body);
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
