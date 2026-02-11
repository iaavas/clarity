import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionsContext } from "@/features/transactions/context/useTransactionsContext";
import type { Category } from "../transaction.schema";

export function FilterBar() {
  const {
    filters,
    setFilters,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    categories,
    openAddDialog,
  } = useTransactionsContext();
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-1 flex-wrap items-end gap-3 gap-y-2">
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs text-slate-500">From</label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="h-9 border-slate-200"
          />
        </div>
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs text-slate-500">To</label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="h-9 border-slate-200"
          />
        </div>
        <div className="min-w-[100px]">
          <label className="mb-1 block text-xs text-slate-500">Type</label>
          <Select
            value={filterType || "all"}
            onValueChange={(v) =>
              setFilterType(v === "all" ? "" : (v as "INCOME" | "EXPENSE"))
            }
          >
            <SelectTrigger className="h-9 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs text-slate-500">Category</label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-9 border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c: Category) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={openAddDialog}
        size="sm"
        className="gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
      >
        <Plus className="h-4 w-4" />
        Add transaction
      </Button>
    </div>
  );
}
