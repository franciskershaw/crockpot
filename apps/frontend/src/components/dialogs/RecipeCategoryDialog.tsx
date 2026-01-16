"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecipeCategoryWithUsage } from "@/data/recipe-categories/getRecipeCategoriesWithUsage";
import { updateRecipeCategory } from "@/actions/recipe-categories";
import { useCreateRecipeCategory } from "@/app/admin/hooks/useCreateRecipeCategory";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RecipeCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  recipeCategory?: RecipeCategoryWithUsage | null;
}

export function RecipeCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
  recipeCategory,
}: RecipeCategoryDialogProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!recipeCategory;
  const createMutation = useCreateRecipeCategory();

  useEffect(() => {
    if (open) {
      setName(recipeCategory?.name || "");
    }
  }, [open, recipeCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name.trim()) return;

    if (isEditing && recipeCategory) {
      setIsSubmitting(true);
      try {
        const result = await updateRecipeCategory(
          { name: name.trim() },
          recipeCategory.id
        );
        if (result.success) {
          toast.success("Recipe category updated successfully!");
          handleClose();
          onSuccess();
        }
      } catch (error) {
        console.error("Update recipe category error:", error);
        toast.error("Failed to update recipe category");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      createMutation.mutate(
        { name: name.trim() },
        {
          onSuccess: (data: {
            success: boolean;
            recipeCategory: unknown;
            message: string;
          }) => {
            if (data.success) {
              toast.success("Recipe category created successfully!");
              handleClose();
              onSuccess();
            }
          },
        }
      );
    }
  };

  const handleClose = () => {
    setName("");
    onOpenChange(false);
  };

  const isLoading = isSubmitting || createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Recipe Category" : "Create New Recipe Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the recipe category name below."
              : "Add a new recipe category. This will be available for all users."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Recipe Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Breakfast, Dinner"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Recipe Category"
              ) : (
                "Create Recipe Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
