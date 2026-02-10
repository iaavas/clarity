import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import transactionRoutes from "./modules/transactions/routes";
import authRoutes from "./modules/auth/routes";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;
