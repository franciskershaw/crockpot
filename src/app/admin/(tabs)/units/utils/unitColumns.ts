import { ColumnDef } from "@tanstack/react-table";
import { UnitWithUsage } from "@/data/units/getUnitsWithUsage";
import {
  createSelectionColumn,
  createTextColumn,
  createDateColumn,
  createActionsColumn,
} from "@/app/admin/components/AdminDataTable/AdminDataTable";

export interface UnitColumnOptions {
  onEdit: (unit: UnitWithUsage) => void;
  onDelete: (unit: UnitWithUsage) => void;
}

export function createUnitColumns(
  options: UnitColumnOptions
): ColumnDef<UnitWithUsage>[] {
  const { onEdit, onDelete } = options;

  return [
    // Selection column
    createSelectionColumn<UnitWithUsage>(),

    // Name column with sorting
    createTextColumn<UnitWithUsage>("name", "Name", {
      sortable: true,
      transform: (value) => {
        const text = value ? String(value) : "";
        return text.trim() === "" ? "DEFAULT" : text;
      },
    }),

    // Abbreviation column
    createTextColumn<UnitWithUsage>("abbreviation", "Abbreviation", {
      sortable: true,
      transform: (value) => {
        const text = value ? String(value) : "";
        return text.trim(); // empty string stays empty for default unit
      },
    }),

    // Usage count column
    createTextColumn<UnitWithUsage>("itemUsageCount", "Items Using", {
      sortable: true,
      transform: (value) => {
        const count = value as number;
        return count === 0 ? "None" : count.toString();
      },
    }),

    // Created date with sorting
    createDateColumn<UnitWithUsage>("createdAt", "Created"),

    // Actions column with dropdown
    createActionsColumn<UnitWithUsage>("Actions", [
      {
        label: "Edit Unit",
        onClick: (unit: UnitWithUsage) => onEdit(unit),
      },
      {
        label: "Delete Unit",
        onClick: (unit: UnitWithUsage) => onDelete(unit),
        variant: "destructive" as const,
      },
    ]),
  ];
}
