import { Request, RequestHandler, Response } from "express";
import * as TransactionService from "./transaction.service";
import { ApiResponse, sendError, sendSuccess } from "../../utils/apiResponse";
import { TransactionFilters } from "./transaction.types";
import { createTransactionSchema } from "./transaction.schema";

const asApiResponse = (res: Response) => res as Response<ApiResponse<unknown>>;

export const getTransactions: RequestHandler = async (req, res) => {
  const response = asApiResponse(res);
  try {
    const { userId, ...rest } = req.query;
    if (!userId || typeof userId !== "string") {
      return sendError(response, "userId is required", 400);
    }
    const transactions = await TransactionService.findAllTransactions({
      userId,
      ...rest,
    } as TransactionFilters);
    return sendSuccess(
      response,
      transactions,
      "Transactions fetched successfully",
      200,
    );
  } catch (error) {
    return sendError(response, "Failed to fetch transactions", 500);
  }
};

export const createTransaction: RequestHandler = async (req, res) => {
  const response = asApiResponse(res);
  try {
    const parsed = createTransactionSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        response,
        parsed.error.flatten().formErrors.join("; ") ||
          "Invalid transaction payload",
        422,
      );
    }

    const transaction = await TransactionService.createNewTransaction(
      parsed.data,
    );
    return sendSuccess(
      response,
      transaction,
      "Transaction created successfully",
      201,
    );
  } catch (error) {
    return sendError(response, "Check your transaction data", 400);
  }
};
