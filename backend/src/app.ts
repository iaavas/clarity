import express from "express";
import cors from "cors";
import transactionRoutes from "./modules/transactions/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

export default app;
