"use client";

import * as React from "react";
import { AdminRecipe } from "@/data/types";
import { AdminDataTable } from "../../components/AdminDataTable/AdminDataTable";
import {
  GenericStatusChangeDialog,
  StatusOption,
} from "../../components/AdminDataTable/GenericStatusChangeDialog";
import { ConfirmationDialog } from "../../components/AdminDataTable/ConfirmationDialog";
import { createRecipeColumns } from "../utils/recipeColumns";
import { useUpdateRecipeStatus } from "../../hooks/useUpdateRecipeStatus";
import { useBulkUpdateRecipeStatus } from "../../hooks/useBulkUpdateRecipeStatus";
import { useDeleteRecipe } from "../../hooks/useDeleteRecipe";
import { useRouter } from "next/navigation";

interface RecipesDataTableProps {
  data: AdminRecipe[];
}

export function RecipesDataTable({ data }: RecipesDataTableProps) {
  const router = useRouter();
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] =
    React.useState<AdminRecipe | null>(null);
  const [selectedRecipes, setSelectedRecipes] = React.useState<AdminRecipe[]>(
    []
  );

  const updateStatusMutation = useUpdateRecipeStatus();
  const bulkUpdateStatusMutation = useBulkUpdateRecipeStatus();
  const deleteRecipeMutation = useDeleteRecipe();

  const handleStatusChange = (recipe: AdminRecipe) => {
    setSelectedRecipe(recipe);
    setStatusDialogOpen(true);
  };

  const handleBulkStatusChange = (recipes: AdminRecipe[]) => {
    setSelectedRecipes(recipes);
    setBulkStatusDialogOpen(true);
  };

  const handleView = (recipe: AdminRecipe) => {
    // Navigate to recipe page
    window.open(`/recipes/${recipe.id}`, "_blank");
  };

  const handleEdit = (recipe: AdminRecipe) => {
    // Navigate to edit page
    router.push(`/recipes/edit/${recipe.id}`);
  };

  const handleDelete = (recipe: AdminRecipe) => {
    setSelectedRecipe(recipe);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = (recipes: AdminRecipe[]) => {
    setSelectedRecipes(recipes);
    setBulkDeleteDialogOpen(true);
  };

  const confirmStatusChange = (approved: boolean) => {
    if (selectedRecipe) {
      updateStatusMutation.mutate(
        { recipeId: selectedRecipe.id, approved },
        {
          onSuccess: () => {
            setStatusDialogOpen(false);
            router.refresh();
          },
        }
      );
    }
  };

  const confirmBulkStatusChange = (approved: boolean) => {
    if (selectedRecipes.length > 0) {
      bulkUpdateStatusMutation.mutate(
        { recipeIds: selectedRecipes.map((r) => r.id), approved },
        {
          onSuccess: () => {
            setBulkStatusDialogOpen(false);
            router.refresh();
          },
        }
      );
    }
  };

  const confirmDelete = () => {
    if (selectedRecipe) {
      deleteRecipeMutation.mutate(selectedRecipe.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          router.refresh();
        },
      });
    }
  };

  const confirmBulkDelete = () => {
    if (selectedRecipes.length > 0) {
      // Delete recipes sequentially to avoid overwhelming the server
      const deletePromises = selectedRecipes.map((recipe) =>
        deleteRecipeMutation.mutateAsync(recipe.id)
      );

      Promise.all(deletePromises)
        .then(() => {
          setBulkDeleteDialogOpen(false);
          router.refresh();
        })
        .catch((error) => {
          console.error("Bulk delete error:", error);
        });
    }
  };

  const columns = createRecipeColumns({
    onStatusChange: handleStatusChange,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const actions = [
    {
      label: "Approve Selected",
      onClick: (recipes: AdminRecipe[]) => handleBulkStatusChange(recipes),
      variant: "default" as const,
    },
    {
      label: "Reject Selected",
      onClick: (recipes: AdminRecipe[]) => handleBulkStatusChange(recipes),
      variant: "destructive" as const,
    },
    {
      label: "Delete Selected",
      onClick: (recipes: AdminRecipe[]) => handleBulkDelete(recipes),
      variant: "destructive" as const,
    },
  ];

  const statusOptions: StatusOption<boolean>[] = [
    {
      label: "Approve",
      value: true,
      colorClass: "bg-green-100 text-green-800",
    },
    {
      label: "Reject",
      value: false,
      colorClass: "bg-red-100 text-red-800",
    },
  ];

  return (
    <>
      <AdminDataTable
        data={data}
        columns={columns}
        searchPlaceholder="Filter by recipe name..."
        searchFields={["name"]}
        actions={actions}
        pageSize={10}
      />

      <GenericStatusChangeDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        currentStatus={selectedRecipe?.approved ?? false}
        statusOptions={statusOptions}
        onConfirm={confirmStatusChange}
        entityName="recipe"
        statusName="status"
      />

      <GenericStatusChangeDialog
        open={bulkStatusDialogOpen}
        onOpenChange={setBulkStatusDialogOpen}
        currentStatus={false}
        statusOptions={statusOptions}
        onConfirm={confirmBulkStatusChange}
        isMultiple={true}
        count={selectedRecipes.length}
        entityName="recipe"
        statusName="status"
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Recipe"
        description={`Are you sure you want to delete "${selectedRecipe?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Delete Recipes"
        description={`Are you sure you want to delete ${selectedRecipes.length} recipe(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
    </>
  );
}
