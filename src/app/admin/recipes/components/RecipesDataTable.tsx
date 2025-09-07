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
import {
  changeRecipeStatus,
  changeRecipesStatus,
  viewRecipe,
  editRecipe,
  deleteRecipeAction,
  deleteRecipes,
} from "../utils/recipeActions";

interface RecipesDataTableProps {
  data: AdminRecipe[];
}

const statusOptions: StatusOption<boolean>[] = [
  {
    value: true,
    label: "Approved",
    colorClass: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: false,
    label: "Pending",
    colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
];

export function RecipesDataTable({ data }: RecipesDataTableProps) {
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [selectedRecipe, setSelectedRecipe] =
    React.useState<AdminRecipe | null>(null);
  const [selectedRecipes, setSelectedRecipes] = React.useState<AdminRecipe[]>(
    []
  );

  const handleStatusChange = (recipe: AdminRecipe) => {
    setSelectedRecipe(recipe);
    setSelectedRecipes([]);
    setStatusDialogOpen(true);
  };

  const handleBulkStatusChange = (recipes: AdminRecipe[]) => {
    setSelectedRecipe(null);
    setSelectedRecipes(recipes);
    setStatusDialogOpen(true);
  };

  const handleStatusConfirm = (newStatus: boolean) => {
    if (selectedRecipe) {
      changeRecipeStatus(selectedRecipe.id, newStatus);
    } else if (selectedRecipes.length > 0) {
      changeRecipesStatus(
        selectedRecipes.map((r) => r.id),
        newStatus
      );
    }
  };

  const handleView = (recipe: AdminRecipe) => {
    viewRecipe(recipe);
  };

  const handleEdit = (recipe: AdminRecipe) => {
    editRecipe(recipe);
  };

  const handleDelete = (recipe: AdminRecipe) => {
    setSelectedRecipe(recipe);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = (recipes: AdminRecipe[]) => {
    setSelectedRecipes(recipes);
    setBulkDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRecipe) {
      deleteRecipeAction(selectedRecipe.id, () => window.location.reload());
    }
  };

  const confirmBulkDelete = () => {
    if (selectedRecipes.length > 0) {
      deleteRecipes(
        selectedRecipes.map((r) => r.id),
        () => window.location.reload()
      );
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
      onClick: (recipes: AdminRecipe[]) =>
        changeRecipesStatus(
          recipes.map((r) => r.id),
          true
        ),
    },
    {
      label: "Mark as Pending",
      onClick: (recipes: AdminRecipe[]) =>
        changeRecipesStatus(
          recipes.map((r) => r.id),
          false
        ),
      variant: "outline" as const,
    },
    {
      label: "Change Status",
      onClick: (recipes: AdminRecipe[]) => handleBulkStatusChange(recipes),
    },
    {
      label: "Delete Selected",
      onClick: (recipes: AdminRecipe[]) => handleBulkDelete(recipes),
      variant: "destructive" as const,
    },
  ];

  const currentStatus =
    selectedRecipe?.approved ??
    (selectedRecipes.length > 0 ? selectedRecipes[0].approved : false);

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
        currentStatus={currentStatus}
        statusOptions={statusOptions}
        onConfirm={handleStatusConfirm}
        isMultiple={selectedRecipes.length > 0}
        count={selectedRecipes.length || 1}
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
