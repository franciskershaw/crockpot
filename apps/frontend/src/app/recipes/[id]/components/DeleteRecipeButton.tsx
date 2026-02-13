"use client";

import { useState } from "react";

import { Trash2 } from "lucide-react";

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
// import { useDeleteRecipe } from "@/hooks/useDeleteRecipe";
import useUser from "@/hooks/user/useUser";
import { ROLE } from "@/shared/constants";
import { Recipe } from "@/shared/types";

const DeleteRecipeButton = ({ recipe }: { recipe: Recipe }) => {
  const { user } = useUser();
  // const deleteRecipeMutation = useDeleteRecipe();
  const [isOpen, setIsOpen] = useState(false);

  const hasPermission =
    (user?.role as unknown as string) === ROLE.ADMIN ||
    recipe.createdById === user?._id;

  if (!hasPermission) {
    return null;
  }

  const handleDelete = () => {
    // deleteRecipeMutation.mutate(recipe.id);
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
            // disabled={deleteRecipeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            // disabled={deleteRecipeMutation.isPending}
          >
            {/* {deleteRecipeMutation.isPending ? "Deleting..." : "Delete Recipe"} */}
            Delete Recipe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRecipeButton;
