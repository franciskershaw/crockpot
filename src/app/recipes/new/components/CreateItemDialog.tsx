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
import { getUnits } from "@/actions/units";
import { getItemCategories } from "@/actions/items";
import type { Item } from "@/data/types";
import { useQuery } from "@tanstack/react-query";
import { tags } from "@/lib/constants";
import { useCreateItem } from "@/hooks/useCreateItem";
import { Loader2 } from "lucide-react";

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemCreated: (item: Item) => void;
  initialCategoryId?: string;
  initialName?: string;
}

export function CreateItemDialog({
  open,
  onOpenChange,
  onItemCreated,
  initialCategoryId,
  initialName,
}: CreateItemDialogProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId || "");
  const [allowedUnitIds, setAllowedUnitIds] = useState<string[]>([]);

  const createItemMutation = useCreateItem();

  // Sync initial name when dialog opens
  useEffect(() => {
    if (open && initialName) {
      setName(initialName);
    }
  }, [open, initialName]);

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

    // Create item data object
    const itemData = {
      name: name.trim(),
      categoryId,
      allowedUnitIds,
    };

    createItemMutation.mutate(itemData, {
      onSuccess: (data) => {
        if (data.success && data.item) {
          // Call the callback with the newly created item
          onItemCreated(data.item);
          // Close the dialog
          handleClose();
        }
      },
    });
  };

  const handleClose = () => {
    setName("");
    setCategoryId(initialCategoryId || "");
    setAllowedUnitIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
          <DialogDescription>
            Add a new ingredient item to the database. This will be available
            for all users.
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
            <Combobox
              options={units.map((unit) => ({
                value: unit.id,
                label: unit.name,
              }))}
              value={allowedUnitIds}
              onValueChange={setAllowedUnitIds}
              placeholder="Select allowed units..."
              emptyIndicator="No units found"
              label="Allowed Units (optional)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !name.trim() || !categoryId || createItemMutation.isPending
              }
            >
              {createItemMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Item...
                </>
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
