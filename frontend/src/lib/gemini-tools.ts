import {
  GoogleGenerativeAI,
  type Tool,
  SchemaType,
  type ObjectSchema,
} from "@google/generative-ai";
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
    systemInstruction: `
      You are a assistant for an expense tracker app named Clairty. 
      Your primary goal is to help users accurately record and categorize their income and expenses. 
      Communicate clearly and concisely, and ensure that all transaction categorizations and suggestions are directly related to personal finance tracking.
    `,
  });

  return model;
}

const schema = {
  description: "The inferred category for a specific transaction description",
  type: SchemaType.OBJECT,
  properties: {
    category: {
      type: SchemaType.STRING,
      description: "A short category name (e.g., 'Groceries', 'Utilities')",
      nullable: false,
    },
  },
  required: ["category"],
};

export async function getCategoryOnly(description: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema as ObjectSchema,
    },
    systemInstruction: `
      You are a data labeling tool. Your only job is to categorize transaction descriptions.
      Keep categories concise (1-3 words). 
      Examples: 
      'Uber' -> 'Transportation'
      'Netflix' -> 'Entertainment'
      'Whole Foods' -> 'Groceries'
    `,
  });

  const result = await model.generateContent(
    `Categorize this: "${description}"`,
  );
  const response = JSON.parse(result.response.text());

  return response.category;
}

export async function processTransaction(rawTransaction: {
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
}) {
  const category = await getCategoryOnly(rawTransaction.description);

  return {
    ...rawTransaction,
    category: category,
  };
}
