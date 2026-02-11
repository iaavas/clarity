import { format } from "date-fns";
import { Pencil, Trash2, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useUIStore } from "@/features/transactions/store/uiStore";

export function TransactionList() {
  const { transactions, isLoading: loading } = useTransactions();
  const onEdit = useUIStore((state) => state.openEditDialog);
  const onDelete = useUIStore((state) => state.openDeleteDialog);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card py-12 text-center">
        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-violet-600" />
        <p className="text-sm text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-12 text-center">
        <p className="text-foreground">No transactions yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-semibold text-foreground">Transactions</h2>
        <span className="text-xs text-muted-foreground">
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">
                {t.description || t.category.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(t.date), "MMM d")} · {t.category.name}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span
                className={
                  t.type === "INCOME"
                    ? "font-medium text-green-600 dark:text-green-400"
                    : "font-medium text-orange-600 dark:text-orange-400"
                }
              >
                {t.type === "INCOME" ? "+" : "-"}$
                {Number(t.amount).toFixed(2)}
              </span>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onEdit(t)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onDelete(t.id)}
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
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
