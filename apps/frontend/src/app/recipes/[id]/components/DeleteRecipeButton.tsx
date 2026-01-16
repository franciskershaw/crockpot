"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Recipe, UserRole } from "@/data/types";
import { User } from "next-auth";
import { useDeleteRecipe } from "@/hooks/useDeleteRecipe";
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

const DeleteRecipeButton = ({
  recipe,
  user,
}: {
  recipe: Recipe;
  user: User;
}) => {
  const deleteRecipeMutation = useDeleteRecipe();
  const [isOpen, setIsOpen] = useState(false);

  const hasPermission =
    user.role === UserRole.ADMIN || recipe.createdById === user.id;

  if (!hasPermission) {
    return null;
  }

  const handleDelete = () => {
    deleteRecipeMutation.mutate(recipe.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete recipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Recipe</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{recipe.name}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={deleteRecipeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteRecipeMutation.isPending}
          >
            {deleteRecipeMutation.isPending ? "Deleting..." : "Delete Recipe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRecipeButton;
