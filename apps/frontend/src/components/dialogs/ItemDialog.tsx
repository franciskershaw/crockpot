"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Item, ItemWithRelations } from "@/data/types";
import { updateItem } from "@/actions/items";
import { getItemCategories } from "@/actions/items";
import { getUnits } from "@/actions/units";
import { useQuery } from "@tanstack/react-query";
import { tags } from "@/lib/constants";
import { useCreateItem } from "@/hooks/useCreateItem";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  item?: ItemWithRelations | null; // If provided, we're editing; if null/undefined, we're creating
  initialCategoryId?: string;
  initialName?: string;
  onItemCreated?: (item: Item) => void; // For recipe creation flow
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!item;
  const createItemMutation = useCreateItem();

  // Reset form when dialog opens or item changes
  useEffect(() => {
    if (open) {
      if (item) {
        // Editing mode - populate with existing data
        setName(item.name);
        setCategoryId(item.categoryId);
        setAllowedUnitIds(item.allowedUnitIds);
      } else {
        // Creating mode - reset form
        setName(initialName || "");
        setCategoryId(initialCategoryId || "");
        setAllowedUnitIds([]);
      }
    }
  }, [open, item, initialName, initialCategoryId]);

  // Fetch categories and units
  const { data: categories = [] } = useQuery({
    queryKey: [tags.CATEGORIES],
    queryFn: getItemCategories,
  });

  const { data: units = [] } = useQuery({
    queryKey: [tags.UNITS],
    queryFn: getUnits,
  });

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
      // Use direct server action for editing
      setIsSubmitting(true);
      try {
        const result = await updateItem(itemData, item.id);
        if (result.success) {
          toast.success("Item updated successfully!");
          handleClose();
          onSuccess();
        }
      } catch (error) {
        console.error("Update item error:", error);
        toast.error("Failed to update item");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Use mutation for creating (supports both admin and recipe flows)
      createItemMutation.mutate(itemData, {
        onSuccess: (data: { success: boolean; item: Item }) => {
          if (data.success && data.item) {
            toast.success("Item created successfully!");
            // Call the callback if provided (for recipe creation flow)
            if (onItemCreated) {
              onItemCreated(data.item);
            }
            handleClose();
            onSuccess();
          }
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

  const isLoading = isSubmitting || createItemMutation.isPending;

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
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-0">
            <Combobox
              options={units
                .filter((unit) => unit.name !== "" && unit.abbreviation !== "")
                .map((unit) => ({
                  value: unit.id,
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
