import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/features/transactions/store/uiStore";
import { useTransactionActions } from "@/features/transactions/hooks/useTransactionActions";

export function DeleteDialog() {
  const deleteId = useUIStore((state) => state.deleteId);
  const open = !!deleteId;
  const onClose = useUIStore((state) => state.closeDeleteDialog);
  const { confirmDelete: onConfirm } = useTransactionActions();
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Delete transaction</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
