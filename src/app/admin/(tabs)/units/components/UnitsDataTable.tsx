"use client";

import * as React from "react";
import { UnitWithUsage } from "@/data/units/getUnitsWithUsage";
import { AdminDataTable } from "@/app/admin/components/AdminDataTable/AdminDataTable";
import { ConfirmationDialog } from "@/app/admin/components/AdminDataTable/ConfirmationDialog";
import { UnitDialog } from "@/components/dialogs/UnitDialog";
import { createUnitColumns } from "../utils/unitColumns";
import { useDeleteUnit } from "@/app/admin/hooks/useDeleteUnit";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UnitsDataTableProps {
  data: UnitWithUsage[];
}

export function UnitsDataTable({ data }: UnitsDataTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [unitDialogOpen, setUnitDialogOpen] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<UnitWithUsage | null>(
    null
  );
  const [selectedUnits, setSelectedUnits] = React.useState<UnitWithUsage[]>([]);
  const [editingUnit, setEditingUnit] = React.useState<UnitWithUsage | null>(
    null
  );

  const deleteUnitMutation = useDeleteUnit();

  const handleEdit = (unit: UnitWithUsage) => {
    setEditingUnit(unit);
    setUnitDialogOpen(true);
  };

  const handleDelete = (unit: UnitWithUsage) => {
    const isDefault =
      unit.name.trim() === "" && unit.abbreviation.trim() === "";
    if (isDefault) {
      toast.warning("The DEFAULT unit cannot be deleted.");
      return;
    }
    if (unit.itemUsageCount && unit.itemUsageCount > 0) {
      toast.warning(
        `${unit.itemUsageCount} item(s) are using this unit. Remove it from those items first.`
      );
      return;
    }
    setSelectedUnit(unit);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = (units: UnitWithUsage[]) => {
    const filtered = units.filter(
      (u) =>
        !(u.name.trim() === "" && u.abbreviation.trim() === "") &&
        (!u.itemUsageCount || u.itemUsageCount === 0)
    );

    const blocked = units.length - filtered.length;
    if (blocked > 0) {
      toast.warning(
        `${blocked} selected unit(s) cannot be deleted (default or in use).`
      );
    }

    if (filtered.length === 0) {
      return;
    }

    setSelectedUnits(filtered);
    setBulkDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingUnit(null);
    setUnitDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUnit) {
      deleteUnitMutation.mutate(selectedUnit.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          router.refresh();
        },
      });
    }
  };

  const confirmBulkDelete = () => {
    if (selectedUnits.length > 0) {
      // Delete units sequentially to avoid overwhelming the server
      const deletePromises = selectedUnits.map((unit) =>
        deleteUnitMutation.mutateAsync(unit.id)
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

  const handleUnitSuccess = () => {
    router.refresh();
  };

  const columns = createUnitColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const actions = [
    {
      label: "Delete Selected",
      onClick: (units: UnitWithUsage[]) => handleBulkDelete(units),
      variant: "destructive" as const,
    },
  ];

  return (
    <>
      <AdminDataTable
        data={data}
        columns={columns}
        searchPlaceholder="Filter by unit name or abbreviation..."
        searchFields={["name", "abbreviation"]}
        actions={actions}
        headerActions={
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Unit
          </Button>
        }
        pageSize={10}
      />

      <UnitDialog
        open={unitDialogOpen}
        onOpenChange={setUnitDialogOpen}
        onSuccess={handleUnitSuccess}
        unit={editingUnit}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Unit"
        description={`Are you sure you want to delete "${selectedUnit?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Delete Units"
        description={`Are you sure you want to delete ${selectedUnits.length} unit(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
    </>
  );
}
