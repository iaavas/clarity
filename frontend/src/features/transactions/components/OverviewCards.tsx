import { TrendingUp, TrendingDown } from "lucide-react";
import { useTransactionsContext } from "@/features/transactions/context/useTransactionsContext";

export function OverviewCards() {
  const { overview } = useTransactionsContext();
  return (
    <div className="mb-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-600">Total Balance</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          ${overview.balance.toFixed(2)}
        </p>
        <div className="mt-4 flex gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-violet-100 px-3 py-2">
            <TrendingDown className="h-4 w-4 text-violet-600" />
            <div>
              <p className="text-xs text-violet-700">Income</p>
              <p className="font-semibold text-violet-900">
                ${overview.income.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-orange-100 px-3 py-2">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-xs text-orange-700">Expenses</p>
              <p className="font-semibold text-orange-900">
                ${overview.expense.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
