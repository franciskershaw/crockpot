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
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";

interface ClearShoppingListDialogProps {
  isMenuEmpty?: boolean;
}

export default function ClearShoppingListDialog({
  isMenuEmpty = false,
}: ClearShoppingListDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  //   const queryClient = useQueryClient();
  //   const { mutate: clearShoppingList, isPending } = useMutation({
  //     mutationFn: clearShoppingList,
  //     onSuccess: () => {
  //       setIsOpen(false);
  //       queryClient.invalidateQueries({ queryKey: ["shoppingList"] });
  //       toast.success("Shopping list cleared successfully");
  //     },
  //     onError: (error) => {
  //       toast.error(
  //         error instanceof Error ? error.message : "Failed to clear shopping list"
  //       );
  //     },
  //   });
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
            // onClick={() => clearShoppingList()}
            // disabled={isPending}
          >
            {/* {isPending ? "Clearing..." : "Clear Shopping List"} */}
            Clear Shopping List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
