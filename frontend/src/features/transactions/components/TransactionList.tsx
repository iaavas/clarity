import { format } from "date-fns";
import { Pencil, Trash2, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactionsContext } from "@/features/transactions/context/useTransactionsContext";

export function TransactionList() {
  const {
    transactions,
    isLoading: loading,
    openEditDialog: onEdit,
    openDeleteDialog: onDelete,
  } = useTransactionsContext();

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 py-12 text-center">
        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-violet-600" />
        <p className="text-sm text-slate-500">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 py-12 text-center">
        <p className="text-slate-600">No transactions yet.</p>
        <p className="mt-1 text-sm text-slate-500">Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-900">Transactions</h2>
        <span className="text-xs text-slate-500">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
              <CircleDollarSign className="h-4 w-4 text-slate-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900">
                {t.description || t.category.name}
              </p>
              <p className="text-xs text-slate-500">
                {format(new Date(t.date), "MMM d")} · {t.category.name}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span
                className={
                  t.type === "INCOME"
                    ? "font-medium text-green-600"
                    : "font-medium text-orange-600"
                }
              >
                {t.type === "INCOME" ? "+" : "-"}$
                {Number(t.amount).toFixed(2)}
              </span>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onEdit(t)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onDelete(t.id)}
                className="h-7 w-7 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
