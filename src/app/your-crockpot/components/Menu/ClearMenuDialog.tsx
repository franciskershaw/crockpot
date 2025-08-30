"use client";

import { removeAllRecipesFromMenu } from "@/actions/menu";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import queryKeys from "@/lib/constants";

interface ClearMenuDialogProps {
  isMenuEmpty?: boolean;
}

export default function ClearMenuDialog({
  isMenuEmpty = false,
}: ClearMenuDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: clearMenu, isPending } = useMutation({
    mutationFn: removeAllRecipesFromMenu,
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: [queryKeys.MENU] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.SHOPPING_LIST] });
      toast.success("Menu cleared successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to clear menu"
      );
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={isMenuEmpty}>
        <Button
          variant="outline"
          className="w-full bg-brand-primary text-white"
          disabled={isMenuEmpty}
        >
          Clear Menu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear Menu</DialogTitle>
          <DialogDescription>
            Are you sure you want to clear your entire menu? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            type="submit"
            onClick={() => clearMenu()}
            disabled={isPending}
          >
            {isPending ? "Clearing..." : "Clear Menu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
