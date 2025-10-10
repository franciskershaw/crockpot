import { ColumnDef } from "@tanstack/react-table";

export interface SortableColumnOptions {
  title: string;
  accessorKey: string;
}

export interface CustomColumnOptions {
  id: string;
  title: string;
  accessorKey?: string;
}

export interface ActionColumnOptions {
  id: string;
  title: string;
  actions: Array<{
    label: string;
    onClick: (row: unknown) => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
    isActive?: (row: unknown) => boolean;
  }>;
}

/**
 * Creates a sortable column definition
 */
export function createSortableColumn<T>(
  options: SortableColumnOptions
): ColumnDef<T> {
  return {
    accessorKey: options.accessorKey,
    header: options.title,
    cell: ({ row }) => {
      const value = row.getValue(options.accessorKey);
      // Handle Date objects
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      return value || "N/A";
    },
  };
}

/**
 * Creates a custom column definition
 */
export function createCustomColumn<T>(
  options: CustomColumnOptions
): ColumnDef<T> {
  return {
    id: options.id,
    header: options.title,
    accessorKey: options.accessorKey,
    cell: ({ row }) => {
      const value = options.accessorKey
        ? row.getValue(options.accessorKey)
        : row.original;

      // Handle Date objects
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }

      return value || "N/A";
    },
  };
}

/**
 * Creates a selection column definition
 */
export function createSelectionColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: "Select",
    cell: ({ row }) => row.getIsSelected(),
    enableSorting: false,
    enableHiding: false,
  };
}
