import {
  DashboardHeader,
  OverviewCards,
  FilterBar,
  TransactionList,
  TransactionDialog,
  DeleteDialog,
  ErrorBanner,
  IncomeExpenseChart,
  CategoryPieChart,
} from "@/features/transactions/components";

import { useDataStore } from "@/features/transactions/store/dataStore";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import {
  useMonthlyFinancials,
  useCategoryExpenses,
} from "@/features/transactions/hooks/useTransactionData";

export default function Dashboard() {
  const filters = useDataStore((state) => state.filters);
  const filterCategory = useDataStore((state) => state.filterCategory);
  const filterType = useDataStore((state) => state.filterType);
  const { userEmail } = useTransactions();
  const monthlyFinancialsQuery = useMonthlyFinancials({
    filters,
    categoryId: filterCategory,
    type: filterType,
    enabled: !!userEmail,
  });
  const categoryExpensesQuery = useCategoryExpenses({
    filters,
    categoryId: filterCategory,
    enabled: !!userEmail,
  });

  const monthlyFinancials = monthlyFinancialsQuery.data || [];
  const categoryExpenses = categoryExpensesQuery.data || [];

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <DashboardHeader />
        <ErrorBanner />
        <OverviewCards />
        
        <div className="mt-8 grid gap-4 grid-cols-1 lg:grid-cols-7 mb-8">
          <IncomeExpenseChart data={monthlyFinancials} />
          <CategoryPieChart data={categoryExpenses} />
        </div>

        <FilterBar />
        <TransactionList />
        <TransactionDialog />
        <DeleteDialog />
      </div>
    </div>
  );
}
