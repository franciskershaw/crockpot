"use client";

import * as React from "react";
import { ItemWithRelations } from "@/data/types";
import { AdminDataTable } from "@/app/admin/components/AdminDataTable/AdminDataTable";
import { ConfirmationDialog } from "@/app/admin/components/AdminDataTable/ConfirmationDialog";
import { ItemDialog } from "@/components/dialogs/ItemDialog";
import { createItemColumns } from "../utils/itemColumns";
import { useDeleteItem } from "@/app/admin/hooks/useDeleteItem";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ItemsDataTableProps {
  data: ItemWithRelations[];
}

export function ItemsDataTable({ data }: ItemsDataTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [itemDialogOpen, setItemDialogOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] =
    React.useState<ItemWithRelations | null>(null);
  const [selectedItems, setSelectedItems] = React.useState<ItemWithRelations[]>(
    []
  );
  const [editingItem, setEditingItem] =
    React.useState<ItemWithRelations | null>(null);

  const deleteItemMutation = useDeleteItem();

  const handleEdit = (item: ItemWithRelations) => {
    setEditingItem(item);
    setItemDialogOpen(true);
  };

  const handleDelete = (item: ItemWithRelations) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = (items: ItemWithRelations[]) => {
    setSelectedItems(items);
    setBulkDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setItemDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteItemMutation.mutate(selectedItem.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          router.refresh();
        },
      });
    }
  };

  const confirmBulkDelete = () => {
    if (selectedItems.length > 0) {
      // Delete items sequentially to avoid overwhelming the server
      const deletePromises = selectedItems.map((item) =>
        deleteItemMutation.mutateAsync(item.id)
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

  const handleItemSuccess = () => {
    router.refresh();
  };

  const columns = createItemColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const actions = [
    {
      label: "Delete Selected",
      onClick: (items: ItemWithRelations[]) => handleBulkDelete(items),
      variant: "destructive" as const,
    },
  ];

  return (
    <>
      <AdminDataTable
        data={data}
        columns={columns}
        searchPlaceholder="Filter by item name..."
        searchFields={["name"]}
        actions={actions}
        headerActions={
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Item
          </Button>
        }
        pageSize={10}
      />

      <ItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        onSuccess={handleItemSuccess}
        item={editingItem}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />

      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Delete Items"
        description={`Are you sure you want to delete ${selectedItems.length} item(s)? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
    </>
  );
}
