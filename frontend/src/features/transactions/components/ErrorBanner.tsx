import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useUIStore } from "@/features/transactions/store/uiStore";

export function ErrorBanner() {
  const { error } = useTransactions();
  const setError = useUIStore((state) => state.setError);
  if (!error) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
      <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
      <p className="text-sm text-destructive flex-1">{error}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setError("")}
        className="h-6 w-6 p-0 hover:bg-destructive/20 text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
