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
import { useDataStore } from "@/features/transactions/store/dataStore";
import { useUIStore } from "@/features/transactions/store/uiStore";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import type { Category } from "../transaction.schema";

export function FilterBar() {
  const filters = useDataStore((state) => state.filters);
  const setFilters = useDataStore((state) => state.setFilters);
  const filterType = useDataStore((state) => state.filterType);
  const setFilterType = useDataStore((state) => state.setFilterType);
  const filterCategory = useDataStore((state) => state.filterCategory);
  const setFilterCategory = useDataStore((state) => state.setFilterCategory);
  const openAddDialog = useUIStore((state) => state.openAddDialog);
  const { categories } = useTransactions();
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-1 flex-wrap items-end gap-3 gap-y-2">
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs text-muted-foreground">
            From
          </label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                startDate: e.target.value || undefined,
              })
            }
            className="h-9"
          />
        </div>
        <div className="min-w-[120px]">
          <label className="mb-1 block text-xs text-muted-foreground">To</label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                endDate: e.target.value || undefined,
              })
            }
            className="h-9 text-white"
          />
        </div>
        <div className="min-w-[100px]">
          <label className="mb-1 block text-xs text-muted-foreground">
            Type
          </label>
          <Select
            value={filterType || "all"}
            onValueChange={(v) =>
              setFilterType(v === "all" ? "" : (v as "INCOME" | "EXPENSE"))
            }
          >
            <SelectTrigger className="h-9">
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
          <label className="mb-1 block text-xs text-muted-foreground">
            Category
          </label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-9">
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
