import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useTransactionActions } from "@/features/transactions/hooks/useTransactionActions";

export function DashboardHeader() {
  const { userEmail } = useTransactions();
  const { handleLogout } = useTransactionActions();
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clarity</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{userEmail}</p>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
