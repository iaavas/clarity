import { TransactionsProvider } from "@/features/transactions/context/TransactionsContext";
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

import { useTransactionsContext } from "@/features/transactions/context/useTransactionsContext";
import {
  useMonthlyFinancials,
  useCategoryExpenses,
} from "@/features/transactions/hooks/useTransactionData";

function DashboardContent() {
  const { filters, filterCategory, filterType, userEmail } = useTransactionsContext();
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

export default function Dashboard() {
  return (
    <TransactionsProvider>
      <DashboardContent />
    </TransactionsProvider>
  );
}
