import { TrendingUp, TrendingDown } from "lucide-react";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";

export function OverviewCards() {
  const { overview } = useTransactions();
  return (
    <div className="mb-6">
      <div className="rounded-xl border border-border bg-card p-5 text-card-foreground">
        <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
        <p className="mt-1 text-2xl font-bold text-foreground">
          ${overview.balance.toFixed(2)}
        </p>
        <div className="mt-4 flex gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-violet-100 px-3 py-2 dark:bg-violet-950/50">
            <TrendingDown className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <div>
              <p className="text-xs text-violet-700 dark:text-violet-300">Income</p>
              <p className="font-semibold text-violet-900 dark:text-violet-200">
                ${overview.income.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-orange-100 px-3 py-2 dark:bg-orange-950/50">
            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-xs text-orange-700 dark:text-orange-300">Expenses</p>
              <p className="font-semibold text-orange-900 dark:text-orange-200">
                ${overview.expense.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
