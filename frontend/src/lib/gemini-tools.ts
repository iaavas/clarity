import { GoogleGenerativeAI, type Tool } from "@google/generative-ai";
import { transactionTools } from "./transaction-tool-declarations";

export function getGeminiModel() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [transactionTools as Tool],
  });

  return model;
}
