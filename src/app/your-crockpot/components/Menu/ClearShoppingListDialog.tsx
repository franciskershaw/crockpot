"use client";

// import { clearShoppingList } from "@/actions/menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useClearShoppingListMutation } from "@/hooks/useShoppingList";
import { toast } from "sonner";

interface ClearShoppingListDialogProps {
  isMenuEmpty?: boolean;
}

export default function ClearShoppingListDialog({
  isMenuEmpty = false,
}: ClearShoppingListDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: clearShoppingList, isPending } =
    useClearShoppingListMutation();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={isMenuEmpty}>
        <Button
          variant="outline"
          className="w-full bg-brand-primary text-white"
          disabled={isMenuEmpty}
        >
          Clear Shopping List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear Shopping List</DialogTitle>
          <DialogDescription>
            Are you sure you want to clear your shopping list? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            type="submit"
            onClick={() =>
              clearShoppingList(undefined, {
                onSuccess: () => {
                  setIsOpen(false);
                  toast.success("Shopping list cleared successfully");
                },
              })
            }
            disabled={isPending}
          >
            {isPending ? "Clearing..." : "Clear Shopping List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
