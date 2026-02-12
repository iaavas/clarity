import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  transactionFormSchema,
  type TransactionFormData,
} from "@/features/transactions/transaction.schema";
import { useUIStore } from "@/features/transactions/store/uiStore";
import { useTransactionActions } from "@/features/transactions/hooks/useTransactionActions";
import { getCategoryOnly } from "@/lib/gemini-tools";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_VALUES: TransactionFormData = {
  amount: 0,
  type: "EXPENSE",
  categoryName: "",
  description: "",
  date: format(new Date(), "yyyy-MM-dd"),
};

export function TransactionDialog() {
  const open = useUIStore((state) => state.editDialogOpen);
  const transaction = useUIStore((state) => state.editingTransaction);
  const step = useUIStore((state) => state.dialogStep);
  const onClose = useUIStore((state) => state.closeEditDialog);
  const nextDialogStep = useUIStore((state) => state.nextDialogStep);
  const prevDialogStep = useUIStore((state) => state.prevDialogStep);
  const resetDialogStep = useUIStore((state) => state.resetDialogStep);
  const { saveTransaction } = useTransactionActions();
  const totalSteps = 3;
  const [categorySuggesting, setCategorySuggesting] = useState(false);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (transaction && open) {
      form.reset({
        amount: Number(transaction.amount),
        type: transaction.type,
        categoryName: transaction.category.name,
        description: transaction.description || "",
        date: format(new Date(transaction.date), "yyyy-MM-dd"),
      });
    } else if (open) {
      form.reset(DEFAULT_VALUES);
    }
  }, [transaction, open, form]);

  useEffect(() => {
    if (!open || step !== 3) return;
    const description = form.getValues("description")?.trim();
    if (!description) return;

    let cancelled = false;
    setCategorySuggesting(true);
    getCategoryOnly(description)
      .then((category) => {
        if (!cancelled) {
          form.setValue("categoryName", category);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCategorySuggesting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, step, form]);

  const handleClose = () => {
    form.reset(DEFAULT_VALUES);
    resetDialogStep();
    onClose();
  };

  const handleNext = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const fieldsByStep: Record<number, (keyof TransactionFormData)[]> = {
      1: ["amount", "type"],
      2: ["description", "date"],
      3: ["categoryName"],
    };
    const isValid = await form.trigger(fieldsByStep[step]);
    if (isValid) {
      nextDialogStep();
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    const currentStep = useUIStore.getState().dialogStep;
    if (currentStep !== totalSteps) {
      return;
    }

    try {
      await saveTransaction({ transaction, data });
      form.reset(DEFAULT_VALUES);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (step < totalSteps) {
        handleNext();
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-112.5" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {transaction ? "Edit" : "New"} Transaction
              </DialogTitle>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Step {step} of {totalSteps}
              </span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all",
                    i <= step ? "bg-violet-600" : "bg-secondary",
                  )}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <Form {...form} key={open ? "open" : "closed"}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const currentStep = useUIStore.getState().dialogStep;
              if (currentStep === totalSteps) {
                form.handleSubmit(onSubmit)(e);
              } else {
                handleNext(e);
              }
            }}
            className="space-y-6 pt-4"
          >
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        <TypeButton
                          type="INCOME"
                          current={field.value}
                          onClick={() => field.onChange("INCOME")}
                          icon={<TrendingUp />}
                        />
                        <TypeButton
                          type="EXPENSE"
                          current={field.value}
                          onClick={() => field.onChange("EXPENSE")}
                          icon={<TrendingDown />}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                          $
                        </span>
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-7 text-xl font-semibold"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <Input type="date" {...field} autoFocus />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <Input
                        placeholder="What was this for?"
                        {...field}
                        className="text-lg"
                      />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Groceries, Rent..."
                          {...field}
                          autoFocus
                          className="text-lg flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Suggest category from description"
                          disabled={
                            categorySuggesting ||
                            !form.watch("description")?.trim()
                          }
                          onClick={async () => {
                            const desc = form.getValues("description")?.trim();
                            if (!desc) return;
                            setCategorySuggesting(true);
                            try {
                              const suggested = await getCategoryOnly(desc);
                              form.setValue("categoryName", suggested);
                            } finally {
                              setCategorySuggesting(false);
                            }
                          }}
                        >
                          {categorySuggesting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="flex flex-row justify-between gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={step === 1 ? handleClose : prevDialogStep}
              >
                {step === 1 ? "Cancel" : "Back"}
              </Button>

              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext(e);
                  }}
                  className="bg-violet-600 px-8"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-violet-600 px-8"
                  onClick={(e) => {
                    const currentStep = useUIStore.getState().dialogStep;
                    if (currentStep !== totalSteps) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  {transaction ? "Save" : "Complete"}{" "}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
function TypeButton({
  type,
  current,
  onClick,
  icon,
}: {
  type: "INCOME" | "EXPENSE";
  current: "INCOME" | "EXPENSE";
  onClick: () => void;
  icon: React.ReactNode;
}) {
  const isActive = current === type;
  const colorClass =
    type === "INCOME"
      ? "text-green-600 border-green-500 bg-green-50"
      : "text-red-600 border-red-500 bg-red-50";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all",
        isActive
          ? colorClass
          : "border-border bg-background text-muted-foreground",
      )}
    >
      {icon}
      <span className="font-semibold capitalize">{type.toLowerCase()}</span>
    </button>
  );
}
