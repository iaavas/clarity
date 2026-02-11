import { TransactionsProvider } from "@/features/transactions/context/TransactionsContext";
import {
  DashboardHeader,
  OverviewCards,
  FilterBar,
  TransactionList,
  TransactionDialog,
  DeleteDialog,
  ErrorBanner,
} from "@/features/transactions/components";

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <DashboardHeader />
        <ErrorBanner />
        <OverviewCards />
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
