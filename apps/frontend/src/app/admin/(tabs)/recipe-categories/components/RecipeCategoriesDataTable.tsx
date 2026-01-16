"use client";

import * as React from "react";
import { RecipeCategoryWithUsage } from "@/data/recipe-categories/getRecipeCategoriesWithUsage";
import { AdminDataTable } from "@/app/admin/components/AdminDataTable/AdminDataTable";
import { ConfirmationDialog } from "@/app/admin/components/AdminDataTable/ConfirmationDialog";
import { RecipeCategoryDialog } from "@/components/dialogs/RecipeCategoryDialog";
import { createRecipeCategoryColumns } from "../utils/recipeCategoryColumns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteRecipeCategory } from "@/app/admin/hooks/useDeleteRecipeCategory";

interface RecipeCategoriesDataTableProps {
  data: RecipeCategoryWithUsage[];
}

export function RecipeCategoriesDataTable({ data }: RecipeCategoriesDataTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<RecipeCategoryWithUsage | null>(null);
  const [selectedMany, setSelectedMany] = React.useState<RecipeCategoryWithUsage[]>([]);
  const [editing, setEditing] = React.useState<RecipeCategoryWithUsage | null>(null);

  const deleteMutation = useDeleteRecipeCategory();

  const handleEdit = (recipeCategory: RecipeCategoryWithUsage) => {
    setEditing(recipeCategory);
    setDialogOpen(true);
  };

  const handleDelete = (recipeCategory: RecipeCategoryWithUsage) => {
    if (recipeCategory.recipeUsageCount > 0) {
      toast.warning(
        `${recipeCategory.recipeUsageCount} recipe(s) are using this recipe category. Remove it from those recipes first.`
      );
      return;
    }
    setSelected(recipeCategory);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = (recipeCategories: RecipeCategoryWithUsage[]) => {
    const filtered = recipeCategories.filter((c) => c.recipeUsageCount === 0);
    const blocked = recipeCategories.length - filtered.length;
    if (blocked > 0) {
      toast.warning(`${blocked} selected recipe category(s) cannot be deleted (in use).`);
    }
    if (filtered.length === 0) return;
    setSelectedMany(filtered);
    setBulkDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selected) {
      deleteMutation.mutate(selected.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          router.refresh();
        },
      });
    }
  };

  const confirmBulkDelete = () => {
    if (selectedMany.length > 0) {
      const promises = selectedMany.map((c) => deleteMutation.mutateAsync(c.id));
      Promise.all(promises)
        .then(() => {
          setBulkDeleteDialogOpen(false);
          router.refresh();
        })
        .catch((error) => console.error("Bulk delete error:", error));
    }
  };

  const handleSuccess = () => router.refresh();

  const columns = createRecipeCategoryColumns({ onEdit: handleEdit, onDelete: handleDelete });

  const actions = [
    {
      label: "Delete Selected",
      onClick: (recipeCategories: RecipeCategoryWithUsage[]) => handleBulkDelete(recipeCategories),
      variant: "destructive" as const,
    },
  ];

  return (
    <>
      <AdminDataTable
        data={data}
        columns={columns}
        searchPlaceholder="Filter by recipe category name..."
        searchFields={["name"]}
        actions={actions}
        headerActions={
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Recipe Category
          </Button>
        }
        pageSize={10}
      />

      <RecipeCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
        recipeCategory={editing}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Recipe Category"
        description={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Delete Recipe Categories"
        description={`Are you sure you want to delete ${selectedMany.length} recipe category(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
    </>
  );
}


