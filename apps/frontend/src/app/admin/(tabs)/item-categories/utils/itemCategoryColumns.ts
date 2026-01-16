import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ItemCategoryWithUsage } from "@/data/item-categories/getItemCategoriesWithUsage";
import {
  createSelectionColumn,
  createTextColumn,
  createDateColumn,
  createActionsColumn,
} from "@/app/admin/components/AdminDataTable/AdminDataTable";
import { getItemCategoryIcon } from "@/lib/icon-map";

export interface ItemCategoryColumnOptions {
  onEdit: (itemCategory: ItemCategoryWithUsage) => void;
  onDelete: (itemCategory: ItemCategoryWithUsage) => void;
}

export function createItemCategoryColumns(
  options: ItemCategoryColumnOptions
): ColumnDef<ItemCategoryWithUsage>[] {
  const { onEdit, onDelete } = options;

  return [
    createSelectionColumn<ItemCategoryWithUsage>(),
    createTextColumn<ItemCategoryWithUsage>("name", "Name", { sortable: true }),
    {
      accessorKey: "faIcon",
      header: "Icon",
      cell: ({ row }) => {
        const iconName = String(row.getValue("faIcon"));
        const IconComponent = getItemCategoryIcon(iconName);

        return React.createElement(
          "div",
          { className: "flex items-center gap-2" },
          React.createElement(IconComponent, { className: "h-5 w-5" }),
          React.createElement(
            "span",
            { className: "text-sm text-gray-600" },
            iconName.startsWith("fa") || !iconName ? "Unknown" : iconName
          )
        );
      },
    },
    createTextColumn<ItemCategoryWithUsage>("itemUsageCount", "Items Using", {
      sortable: true,
      transform: (value) => {
        const count = value as number;
        return count === 0 ? "None" : String(count);
      },
    }),
    createDateColumn<ItemCategoryWithUsage>("createdAt", "Created"),
    createActionsColumn<ItemCategoryWithUsage>("Actions", [
      { label: "Edit Item Category", onClick: (c) => onEdit(c) },
      {
        label: "Delete Item Category",
        onClick: (c) => onDelete(c),
        variant: "destructive",
      },
    ]),
  ];
}
