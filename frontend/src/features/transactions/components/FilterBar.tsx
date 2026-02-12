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

function FilterField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

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
    <div className="mb-6 rounded-xl border border-border/80 bg-card/50 p-4  backdrop-blur-sm md:p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:flex-none lg:flex lg:flex-none lg:gap-3">
          <FilterField label="From" className="w-full sm:min-w-[140px]">
            <Input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  startDate: e.target.value || undefined,
                })
              }
              className="h-10 w-full sm:h-9"
            />
          </FilterField>
          <FilterField label="To" className="w-full sm:min-w-[140px]">
            <Input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  endDate: e.target.value || undefined,
                })
              }
              className="h-10 w-full sm:h-9"
            />
          </FilterField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:flex-none lg:flex lg:flex-none lg:gap-3">
          <FilterField label="Type" className="w-full sm:min-w-[120px]">
            <Select
              value={filterType || "all"}
              onValueChange={(v) =>
                setFilterType(v === "all" ? "" : (v as "INCOME" | "EXPENSE"))
              }
            >
              <SelectTrigger className="h-10 w-full sm:h-9 sm:w-[120px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Category" className="w-full sm:min-w-[140px]">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-10 w-full sm:h-9 sm:min-w-[140px]">
                <SelectValue placeholder="Category" />
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
          </FilterField>
        </div>

        <div className="flex shrink-0 lg:ml-auto">
          <Button
            onClick={openAddDialog}
            size="sm"
            className="h-10 w-full gap-2 bg-violet-600 text-white shadow-sm hover:bg-violet-700 sm:h-9 sm:w-auto sm:min-w-[140px] cursor-pointer"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Add transaction</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
