"use client";

import * as React from "react";
import { ItemCategoryWithUsage } from "@/data/item-categories/getItemCategoriesWithUsage";
import { AdminDataTable } from "@/app/admin/components/AdminDataTable/AdminDataTable";
import { ConfirmationDialog } from "@/app/admin/components/AdminDataTable/ConfirmationDialog";
import { ItemCategoryDialog } from "@/components/dialogs/ItemCategoryDialog";
import { createItemCategoryColumns } from "../utils/itemCategoryColumns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteItemCategory } from "@/app/admin/hooks/useDeleteItemCategory";

interface ItemCategoriesDataTableProps {
  data: ItemCategoryWithUsage[];
}

export function ItemCategoriesDataTable({
  data,
}: ItemCategoriesDataTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ItemCategoryWithUsage | null>(
    null
  );
  const [selectedMany, setSelectedMany] = React.useState<
    ItemCategoryWithUsage[]
  >([]);
  const [editing, setEditing] = React.useState<ItemCategoryWithUsage | null>(
    null
  );

  const deleteMutation = useDeleteItemCategory();

  const handleEdit = (itemCategory: ItemCategoryWithUsage) => {
    setEditing(itemCategory);
    setDialogOpen(true);
  };

  const handleDelete = (itemCategory: ItemCategoryWithUsage) => {
    if (itemCategory.itemUsageCount > 0) {
      toast.warning(
        `${itemCategory.itemUsageCount} item(s) are using this item category. Remove it from those items first.`
      );
      return;
    }
    setSelected(itemCategory);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = (itemCategories: ItemCategoryWithUsage[]) => {
    const filtered = itemCategories.filter((c) => c.itemUsageCount === 0);
    const blocked = itemCategories.length - filtered.length;
    if (blocked > 0) {
      toast.warning(
        `${blocked} selected item category(s) cannot be deleted (in use).`
      );
    }
    if (filtered.length === 0) return;
    setSelectedMany(filtered);
    setBulkDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteMutation.mutateAsync(selected.id);
      setDeleteDialogOpen(false);
      setSelected(null);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedMany.map((itemCategory) =>
          deleteMutation.mutateAsync(itemCategory.id)
        )
      );
      setBulkDeleteDialogOpen(false);
      setSelectedMany([]);
      router.refresh();
    } catch (error) {
      console.error("Bulk delete error:", error);
    }
  };

  const handleSuccess = () => router.refresh();

  const columns = createItemCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const actions = [
    {
      label: "Delete Selected",
      onClick: (itemCategories: ItemCategoryWithUsage[]) =>
        handleBulkDelete(itemCategories),
      variant: "destructive" as const,
    },
  ];

  return (
    <>
      <AdminDataTable
        data={data}
        columns={columns}
        searchPlaceholder="Filter by item category name..."
        searchFields={["name"]}
        actions={actions}
        headerActions={
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Item Category
          </Button>
        }
        pageSize={10}
      />

      <ItemCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
        itemCategory={editing}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item Category"
        description={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Delete Item Categories"
        description={`Are you sure you want to delete ${selectedMany.length} item category(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
    </>
  );
}
