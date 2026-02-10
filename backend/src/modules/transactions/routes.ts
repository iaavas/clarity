import { Router } from "express";
import * as TransactionController from "./transaction.controller";

const router = Router();

router.get("/", TransactionController.getTransactions);
router.post("/", TransactionController.createTransaction);

export default router;
