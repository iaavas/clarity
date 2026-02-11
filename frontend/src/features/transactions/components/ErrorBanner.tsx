import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactionsContext } from "@/features/transactions/context/useTransactionsContext";

export function ErrorBanner() {
  const { error, setError } = useTransactionsContext();
  if (!error) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
      <p className="text-sm text-red-800 flex-1">{error}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setError("")}
        className="h-6 w-6 p-0 hover:bg-red-100"
      >
        <X className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
}
