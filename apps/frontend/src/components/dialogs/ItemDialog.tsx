"use client";

import { useEffect, useState } from "react";

import { Loader2 } from "lucide-react";

import useCreateItem from "@/app/items/hooks/useCreateItem";
import useGetItemCategories from "@/app/items/hooks/useGetItemCategories";
import useUpdateItem from "@/app/items/hooks/useUpdateItem";
import useGetUnits from "@/app/units/hooks/useGetUnits";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Item, ItemCategory, Unit } from "@/shared/types";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  item?: Item | null; // If provided, we're editing; if null/undefined, we're creating
  initialCategoryId?: string;
  initialName?: string;
  onItemCreated?: (item: Item) => void; // For recipe creation flow and shopping list
}

export function ItemDialog({
  open,
  onOpenChange,
  onSuccess,
  item,
  initialCategoryId,
  initialName,
  onItemCreated,
}: ItemDialogProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [allowedUnitIds, setAllowedUnitIds] = useState<string[]>([]);

  const isEditing = !!item;

  // Hooks
  const createItemMutation = useCreateItem();
  const updateItemMutation = useUpdateItem();
  const { categories = [], isLoading: categoriesLoading } =
    useGetItemCategories();
  const { units = [], isLoading: unitsLoading } = useGetUnits();

  // Reset form when dialog opens or item changes
  useEffect(() => {
    if (open) {
      if (item) {
        // Editing mode - populate with existing data
        setName(item.name);
        setCategoryId(
          typeof item.categoryId === "string"
            ? item.categoryId
            : item.categoryId._id
        );
        setAllowedUnitIds(
          Array.isArray(item.allowedUnitIds)
            ? item.allowedUnitIds.map((unit) =>
                typeof unit === "string" ? unit : unit._id
              )
            : []
        );
      } else {
        // Creating mode - reset form
        setName(initialName || "");
        setCategoryId(initialCategoryId || "");
        setAllowedUnitIds([]);
      }
    }
  }, [open, item, initialName, initialCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name.trim() || !categoryId) {
      return;
    }

    const itemData = {
      name: name.trim(),
      categoryId,
      allowedUnitIds,
    };

    if (isEditing && item) {
      // Update existing item
      updateItemMutation.mutate(
        { itemId: item._id, data: itemData },
        {
          onSuccess: (updatedItem: Item) => {
            if (onItemCreated) {
              onItemCreated(updatedItem);
            }
            handleClose();
            onSuccess();
          },
        }
      );
    } else {
      // Create new item
      createItemMutation.mutate(itemData, {
        onSuccess: (createdItem: Item) => {
          if (onItemCreated) {
            onItemCreated(createdItem);
          }
          handleClose();
          onSuccess();
        },
      });
    }
  };

  const handleClose = () => {
    setName("");
    setCategoryId("");
    setAllowedUnitIds([]);
    onOpenChange(false);
  };

  const isLoading =
    createItemMutation.isPending ||
    updateItemMutation.isPending ||
    categoriesLoading ||
    unitsLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Item" : "Create New Item"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the item details below."
              : "Add a new ingredient item to the database. This will be available for all users."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
          <div className="space-y-2 min-w-0">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Basil"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2 min-w-0">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat: ItemCategory) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-0">
            <Combobox
              options={units
                ?.filter(
                  (unit: Unit) => unit.name !== "" && unit.abbreviation !== ""
                )
                .map((unit: Unit) => ({
                  value: unit._id,
                  label: unit.name,
                }))}
              value={allowedUnitIds}
              onValueChange={setAllowedUnitIds}
              placeholder="Select allowed units..."
              emptyIndicator="No units found"
              label="Allowed Units (optional)"
              modal={true}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !categoryId || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Item"
              ) : (
                "Create Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ItemDialog;
