import { ColumnDef } from "@tanstack/react-table";
import { RecipeCategoryWithUsage } from "@/data/recipe-categories/getRecipeCategoriesWithUsage";
import {
  createSelectionColumn,
  createTextColumn,
  createDateColumn,
  createActionsColumn,
} from "@/app/admin/components/AdminDataTable/AdminDataTable";

export interface RecipeCategoryColumnOptions {
  onEdit: (recipeCategory: RecipeCategoryWithUsage) => void;
  onDelete: (recipeCategory: RecipeCategoryWithUsage) => void;
}

export function createRecipeCategoryColumns(
  options: RecipeCategoryColumnOptions
): ColumnDef<RecipeCategoryWithUsage>[] {
  const { onEdit, onDelete } = options;

  return [
    createSelectionColumn<RecipeCategoryWithUsage>(),
    createTextColumn<RecipeCategoryWithUsage>("name", "Name", { sortable: true }),
    createTextColumn<RecipeCategoryWithUsage>("recipeUsageCount", "Recipes Using", {
      sortable: true,
      transform: (value) => {
        const count = value as number;
        return count === 0 ? "None" : String(count);
      },
    }),
    createDateColumn<RecipeCategoryWithUsage>("createdAt", "Created"),
    createActionsColumn<RecipeCategoryWithUsage>("Actions", [
      { label: "Edit Recipe Category", onClick: (c) => onEdit(c) },
      { label: "Delete Recipe Category", onClick: (c) => onDelete(c), variant: "destructive" },
    ]),
  ];
}


