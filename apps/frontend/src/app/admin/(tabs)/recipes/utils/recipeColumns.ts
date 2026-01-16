import { ColumnDef } from "@tanstack/react-table";
import { AdminRecipe } from "@/data/types";
import {
  createSelectionColumn,
  createTextColumn,
  createDateColumn,
  createCountColumn,
  createActionsColumn,
} from "@/app/admin/components/AdminDataTable/AdminDataTable";

export interface RecipeColumnOptions {
  onStatusChange: (recipe: AdminRecipe) => void;
  onView: (recipe: AdminRecipe) => void;
  onEdit: (recipe: AdminRecipe) => void;
  onDelete: (recipe: AdminRecipe) => void;
}

export function createRecipeColumns(
  options: RecipeColumnOptions
): ColumnDef<AdminRecipe>[] {
  const { onStatusChange, onView, onEdit, onDelete } = options;

  return [
    // Selection column
    createSelectionColumn<AdminRecipe>(),

    // Name column with sorting
    createTextColumn<AdminRecipe>("name", "Name", {
      sortable: true,
      transform: (value) => (value ? String(value) : "No name"),
    }),

    // Status column
    createTextColumn<AdminRecipe>("approved", "Status", {
      sortable: true,
      transform: (value) => ((value as boolean) ? "Approved" : "Pending"),
    }),

    // Created by column
    createTextColumn<AdminRecipe>(
      "createdBy" as keyof AdminRecipe,
      "Created By",
      {
        sortable: false,
        transform: (value) => {
          const createdBy = value as AdminRecipe["createdBy"];
          if (!createdBy) return "Unknown";
          return createdBy.name || createdBy.email || "Unknown";
        },
      }
    ),

    // Categories column
    createTextColumn<AdminRecipe>(
      "categories" as keyof AdminRecipe,
      "Categories",
      {
        sortable: false,
        transform: (value) => {
          const categories = value as AdminRecipe["categories"];
          if (!categories || categories.length === 0) return "None";
          return categories.map((cat) => cat.name).join(", ");
        },
      }
    ),

    // Ingredients count
    createCountColumn<AdminRecipe>(
      "ingredients",
      "Ingredients",
      (recipe) => recipe._count.ingredients
    ),

    // Instructions count
    createCountColumn<AdminRecipe>(
      "instructions",
      "Instructions",
      (recipe) => recipe._count.instructions
    ),

    // Created date with sorting
    createDateColumn<AdminRecipe>("createdAt", "Created"),

    // Actions column with dropdown
    createActionsColumn<AdminRecipe>("Actions", [
      {
        label: "Change Status",
        onClick: (recipe: AdminRecipe) => onStatusChange(recipe),
      },
      {
        label: "View Recipe",
        onClick: (recipe: AdminRecipe) => onView(recipe),
      },
      {
        label: "Edit Recipe",
        onClick: (recipe: AdminRecipe) => onEdit(recipe),
      },
      {
        label: "Delete Recipe",
        onClick: (recipe: AdminRecipe) => onDelete(recipe),
        variant: "destructive" as const,
      },
    ]),
  ];
}
