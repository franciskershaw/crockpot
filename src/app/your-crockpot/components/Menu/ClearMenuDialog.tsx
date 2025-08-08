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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ClearMenuDialogProps {
  children: React.ReactNode;
  isMenuEmpty?: boolean;
}

export default function ClearMenuDialog({
  children,
  isMenuEmpty = false,
}: ClearMenuDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: clearMenu, isPending } = useMutation({
    mutationFn: removeAllRecipesFromMenu,
    onSuccess: () => {
      setIsOpen(false);
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
        {children}
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
            className="w-full"
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
