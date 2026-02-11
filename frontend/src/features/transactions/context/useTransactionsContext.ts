import { useContext } from "react";
import { TransactionsContext } from "./transactionsContextState";

export function useTransactionsContext() {
  const ctx = useContext(TransactionsContext);
  if (!ctx) {
    throw new Error(
      "useTransactionsContext must be used within TransactionsProvider"
    );
  }
  return ctx;
}
