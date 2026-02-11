import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactionsContext } from "@/features/transactions/context/useTransactionsContext";

export function DashboardHeader() {
  const { userEmail, handleLogout } = useTransactionsContext();
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clarity</h1>
        <p className="text-sm text-slate-500 mt-0.5">{userEmail}</p>
      </div>
      <Button onClick={handleLogout} variant="outline" size="sm" className="gap-1.5">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </header>
  );
}
