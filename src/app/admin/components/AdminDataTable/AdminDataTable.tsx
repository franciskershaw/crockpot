"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  HeaderContext,
  CellContext,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// React components for creating common column types
interface SortableHeaderProps<T> {
  column: HeaderContext<T, unknown>["column"];
  title: string;
}

export const SortableHeader = <T,>({
  column,
  title,
}: SortableHeaderProps<T>) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {title}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

interface SelectionHeaderProps<T> {
  table: HeaderContext<T, unknown>["table"];
}

export const SelectionHeader = <T,>({ table }: SelectionHeaderProps<T>) => (
  <Checkbox
    checked={
      table.getIsAllPageRowsSelected() ||
      (table.getIsSomePageRowsSelected() && "indeterminate")
    }
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label="Select all"
  />
);

interface SelectionCellProps<T> {
  row: CellContext<T, unknown>["row"];
}

export const SelectionCell = <T,>({ row }: SelectionCellProps<T>) => (
  <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label="Select row"
  />
);

export const createSelectionColumn = <T,>(): ColumnDef<T> => ({
  id: "select",
  header: ({ table }: HeaderContext<T, unknown>) => (
    <SelectionHeader table={table} />
  ),
  cell: ({ row }: CellContext<T, unknown>) => <SelectionCell row={row} />,
  enableSorting: false,
  enableHiding: false,
});

interface ActionItem<T> {
  label: string;
  onClick: (item: T) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  isActive?: (item: T) => boolean;
}

interface ActionsCellProps<T> {
  row: CellContext<T, unknown>["row"];
  actions: ActionItem<T>[];
}

export const ActionsCell = <T,>({ row, actions }: ActionsCellProps<T>) => {
  const item = row.original as T;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => action.onClick(item)}
            className={action.isActive?.(item) ? "bg-accent" : ""}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createActionsColumn = <T,>(
  title: string,
  actions: ActionItem<T>[]
): ColumnDef<T> => ({
  id: "actions",
  header: title,
  enableHiding: false,
  cell: ({ row }: CellContext<T, unknown>) => (
    <ActionsCell row={row} actions={actions} />
  ),
});

interface BadgeCellProps<T> {
  row: CellContext<T, unknown>["row"];
  accessorKey: string;
  badgeColors: Record<string, string>;
}

export const BadgeCell = <T,>({
  row,
  accessorKey,
  badgeColors,
}: BadgeCellProps<T>) => {
  const value = row.getValue(accessorKey) as string;
  return (
    <Badge className={badgeColors[value] || "bg-gray-100 text-gray-800"}>
      {value}
    </Badge>
  );
};

export const createBadgeColumn = <T,>(
  accessorKey: keyof T,
  title: string,
  badgeColors: Record<string, string>
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header: title,
  cell: ({ row }: CellContext<T, unknown>) => (
    <BadgeCell
      row={row}
      accessorKey={accessorKey as string}
      badgeColors={badgeColors}
    />
  ),
});

interface DateCellProps<T> {
  row: CellContext<T, unknown>["row"];
  accessorKey: string;
}

export const DateCell = <T,>({ row, accessorKey }: DateCellProps<T>) => {
  const date = row.getValue(accessorKey) as Date;
  return <div>{new Date(date).toLocaleDateString()}</div>;
};

export const createDateColumn = <T,>(
  accessorKey: keyof T,
  title: string
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header: ({ column }: HeaderContext<T, unknown>) => (
    <SortableHeader column={column} title={title} />
  ),
  cell: ({ row }: CellContext<T, unknown>) => (
    <DateCell row={row} accessorKey={accessorKey as string} />
  ),
});

interface TextCellProps<T> {
  row: CellContext<T, unknown>["row"];
  accessorKey: string;
  transform?: (value: unknown) => string;
}

export const TextCell = <T,>({
  row,
  accessorKey,
  transform,
}: TextCellProps<T>) => {
  const value = row.getValue(accessorKey);
  const displayValue = transform
    ? transform(value)
    : value
    ? String(value)
    : "N/A";
  return <div>{displayValue}</div>;
};

export const createTextColumn = <T,>(
  accessorKey: keyof T,
  title: string,
  options?: {
    sortable?: boolean;
    transform?: (value: unknown) => string;
  }
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header: options?.sortable
    ? ({ column }: HeaderContext<T, unknown>) => (
        <SortableHeader column={column} title={title} />
      )
    : title,
  cell: ({ row }: CellContext<T, unknown>) => (
    <TextCell
      row={row}
      accessorKey={accessorKey as string}
      transform={options?.transform}
    />
  ),
});

interface CountCellProps<T> {
  row: CellContext<T, unknown>["row"];
  getCount: (item: T) => number;
}

export const CountCell = <T,>({ row, getCount }: CountCellProps<T>) => {
  const count = getCount(row.original as T);
  return <div className="text-center">{count}</div>;
};

export const createCountColumn = <T,>(
  id: string,
  title: string,
  getCount: (item: T) => number
): ColumnDef<T> => ({
  id,
  header: title,
  cell: ({ row }: CellContext<T, unknown>) => (
    <CountCell row={row} getCount={getCount} />
  ),
});

export interface AdminDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchFields?: string[];
  actions?: Array<{
    label: string;
    onClick: (items: T[]) => void;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  }>;
  globalFilterFn?: (row: unknown, columnId: string, value: string) => boolean;
  pageSize?: number;
}

export function AdminDataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchFields = [],
  actions = [],
  globalFilterFn,
  pageSize = 10,
}: AdminDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn:
      globalFilterFn ||
      ((row, columnId, value) => {
        const search = value.toLowerCase();
        return searchFields.some((field) => {
          const fieldValue = row.original[field as keyof T];
          return fieldValue?.toString().toLowerCase().includes(search);
        });
      }),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const handleAction = (actionIndex: number) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedItems = selectedRows.map((row) => row.original);
    const action = actions[actionIndex];
    if (action) {
      action.onClick(selectedItems);
    }
  };

  return (
    <div className="w-full">
      {/* Search and Actions Bar */}
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />

        {table.getFilteredSelectedRowModel().rows.length > 0 &&
          actions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} selected
              </span>
              <Select onValueChange={(value) => handleAction(parseInt(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Actions..." />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
