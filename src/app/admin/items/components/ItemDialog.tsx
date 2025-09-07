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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemCategory, Unit, ItemWithRelations } from "@/data/types";
import { createItem, updateItem } from "@/actions/items";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ItemCategory[];
  units: Unit[];
  onSuccess: () => void;
  item?: ItemWithRelations | null; // If provided, we're editing; if null/undefined, we're creating
}

export function ItemDialog({
  open,
  onOpenChange,
  categories,
  units,
  onSuccess,
  item,
}: ItemDialogProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [allowedUnitIds, setAllowedUnitIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!item;

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
        setName("");
        setCategoryId("");
        setAllowedUnitIds([]);
      }
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name.trim() || !categoryId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const itemData = {
        name: name.trim(),
        categoryId,
        allowedUnitIds,
      };

      let result;
      if (isEditing && item) {
        result = await updateItem(itemData, item.id);
      } else {
        result = await createItem(itemData);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? "Item updated successfully!"
            : "Item created successfully!"
        );
        handleClose();
        onSuccess();
      }
    } catch (error) {
      console.error(`${isEditing ? "Update" : "Create"} item error:`, error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} item`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setCategoryId("");
    setAllowedUnitIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Basil"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Allowed Units (optional)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {units.map((unit) => (
                <label
                  key={unit.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={allowedUnitIds.includes(unit.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAllowedUnitIds([...allowedUnitIds, unit.id]);
                      } else {
                        setAllowedUnitIds(
                          allowedUnitIds.filter((id) => id !== unit.id)
                        );
                      }
                    }}
                    className="rounded"
                  />
                  <span>{unit.name}</span>
                </label>
              ))}
            </div>
            {allowedUnitIds.length === 0 && (
              <div className="text-sm text-gray-500">All units allowed</div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !categoryId || isSubmitting}
            >
              {isSubmitting ? (
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
