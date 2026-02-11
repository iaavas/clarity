import { Router } from "express";
import * as TransactionController from "./transaction.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", TransactionController.getTransactions);
router.get("/overview", TransactionController.getOverview);
router.get("/monthly-financials", TransactionController.getMonthlyFinancials);
router.get("/category-expenses", TransactionController.getCategoryExpenses);
router.get("/categories", TransactionController.getCategories);
router.post("/", TransactionController.createTransaction);
router.patch("/:id", TransactionController.updateTransaction);
router.delete("/:id", TransactionController.deleteTransaction);

export default router;
