import { ColumnDef } from "@tanstack/react-table";
import { ItemWithRelations } from "@/data/types";
import {
  createSelectionColumn,
  createTextColumn,
  createDateColumn,
  createActionsColumn,
} from "../../components/AdminDataTable/AdminDataTable";

export interface ItemColumnOptions {
  onEdit: (item: ItemWithRelations) => void;
  onDelete: (item: ItemWithRelations) => void;
}

export function createItemColumns(
  options: ItemColumnOptions
): ColumnDef<ItemWithRelations>[] {
  const { onEdit, onDelete } = options;

  return [
    // Selection column
    createSelectionColumn<ItemWithRelations>(),

    // Name column with sorting
    createTextColumn<ItemWithRelations>("name", "Name", {
      sortable: true,
      transform: (value) => (value ? String(value) : "No name"),
    }),

    // Category column
    createTextColumn<ItemWithRelations>(
      "category" as keyof ItemWithRelations,
      "Category",
      {
        sortable: false,
        transform: (value) => {
          const category = value as ItemWithRelations["category"];
          return category?.name || "Unknown";
        },
      }
    ),

    // Allowed units column
    createTextColumn<ItemWithRelations>(
      "allowedUnits" as keyof ItemWithRelations,
      "Allowed Units",
      {
        sortable: false,
        transform: (value) => {
          const units = value as ItemWithRelations["allowedUnits"];
          if (!units || units.length === 0) return "All";
          return units.map((unit) => unit.abbreviation).join(", ");
        },
      }
    ),

    // Created date with sorting
    createDateColumn<ItemWithRelations>("createdAt", "Created"),

    // Actions column with dropdown
    createActionsColumn<ItemWithRelations>("Actions", [
      {
        label: "Edit Item",
        onClick: (item: ItemWithRelations) => onEdit(item),
      },
      {
        label: "Delete Item",
        onClick: (item: ItemWithRelations) => onDelete(item),
        variant: "destructive" as const,
      },
    ]),
  ];
}
