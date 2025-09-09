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
import { ItemCategoryWithUsage } from "@/data/item-categories/getItemCategoriesWithUsage";
import { updateItemCategory } from "@/actions/item-categories";
import { useCreateItemCategory } from "@/app/admin/hooks/useCreateItemCategory";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { ITEM_CATEGORY_ICONS, getItemCategoryIcon } from "@/lib/icon-map";

interface ItemCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  itemCategory?: ItemCategoryWithUsage | null;
}

export function ItemCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
  itemCategory,
}: ItemCategoryDialogProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Package");
  const [iconSearch, setIconSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!itemCategory;
  const createMutation = useCreateItemCategory();

  useEffect(() => {
    if (open) {
      setName(itemCategory?.name || "");
      setSelectedIcon(itemCategory?.faIcon || "Package");
      setIconSearch("");
    }
  }, [open, itemCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name.trim()) return;

    if (isEditing && itemCategory) {
      setIsSubmitting(true);
      try {
        const result = await updateItemCategory(
          { name: name.trim(), faIcon: selectedIcon },
          itemCategory.id
        );
        if (result.success) {
          toast.success("Item category updated successfully!");
          handleClose();
          onSuccess();
        }
      } catch (error) {
        console.error("Update item category error:", error);
        toast.error("Failed to update item category");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      createMutation.mutate(
        { name: name.trim(), faIcon: selectedIcon },
        {
          onSuccess: (data: {
            success: boolean;
            itemCategory: unknown;
            message: string;
          }) => {
            if (data.success) {
              toast.success("Item category created successfully!");
              handleClose();
              onSuccess();
            }
          },
        }
      );
    }
  };

  const handleClose = () => {
    setName("");
    setSelectedIcon("Package");
    setIconSearch("");
    onOpenChange(false);
  };

  const filteredIcons = Object.entries(ITEM_CATEGORY_ICONS).filter(
    ([iconName]) => iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const isLoading = isSubmitting || createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Item Category" : "Create New Item Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the item category name and icon below."
              : "Add a new item category. This will be available for all users."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Category Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Meat, Vegetables, Dairy"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Icon *</Label>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search icons..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="border rounded-lg p-3">
                <div className="text-sm font-medium mb-2">Selected Icon:</div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const IconComponent = getItemCategoryIcon(selectedIcon);
                    return <IconComponent className="h-6 w-6" />;
                  })()}
                  <span className="text-sm text-gray-600">{selectedIcon}</span>
                </div>
              </div>

              <div className="h-48 border rounded-lg overflow-y-auto">
                <div className="grid grid-cols-8 gap-2 p-3">
                  {filteredIcons.map(([iconName, IconComponent]) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      className={`p-2 rounded-lg border-2 transition-colors hover:bg-gray-50 ${
                        selectedIcon === iconName
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      title={iconName}
                    >
                      <IconComponent className="h-5 w-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Item Category"
              ) : (
                "Create Item Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
