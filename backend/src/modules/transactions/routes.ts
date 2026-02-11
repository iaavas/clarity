import { Router } from "express";
import * as TransactionController from "./transaction.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/", TransactionController.getTransactions);
router.post("/", TransactionController.createTransaction);
router.patch("/:id", TransactionController.updateTransaction);
router.delete("/:id", TransactionController.deleteTransaction);

export default router;
