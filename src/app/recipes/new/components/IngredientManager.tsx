"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import Searchable from "@/components/ui/searchable";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { hasPermission, Permission } from "@/lib/action-helpers";
import { ItemDialog } from "@/components/dialogs/ItemDialog";
import type { Item, Unit } from "@/data/types";

export type IngredientItem = {
  id: string;
  itemId: string;
  itemName: string;
  unitId: string | null;
  unitName: string | null;
  quantity: number;
};

interface IngredientManagerProps {
  availableIngredients: Item[];
  units: Unit[];
  selectedIngredients: IngredientItem[];
  onIngredientsChange: (ingredients: IngredientItem[]) => void;
  className?: string;
}

export default function IngredientManager({
  availableIngredients,
  units,
  selectedIngredients,
  onIngredientsChange,
  className,
}: IngredientManagerProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showCreateItemDialog, setShowCreateItemDialog] = useState(false);
  const { data: session } = useSession();

  const canCreateItems =
    session?.user && hasPermission(session.user.role, Permission.CREATE_ITEMS);
  const handleIngredientSelect = (ingredientId: string) => {
    const ingredient = availableIngredients.find(
      (item) => item.id === ingredientId
    );
    if (ingredient) {
      // Check if ingredient is already selected
      const alreadySelected = selectedIngredients.some(
        (selected) => selected.itemId === ingredient.id
      );

      if (!alreadySelected) {
        const newIngredient: IngredientItem = {
          id: crypto.randomUUID(),
          itemId: ingredient.id,
          itemName: ingredient.name,
          unitId: null,
          unitName: null,
          quantity: 1,
        };

        onIngredientsChange([...selectedIngredients, newIngredient]);
      }
    }

    // Clear the searchable input after selection
    setSearchValue("");
  };

  const handleItemCreated = (newItem: Item) => {
    // Close the dialog
    setShowCreateItemDialog(false);

    // Automatically select the newly created item
    const newIngredient: IngredientItem = {
      id: crypto.randomUUID(),
      itemId: newItem.id,
      itemName: newItem.name,
      unitId: null,
      unitName: null,
      quantity: 1,
    };

    onIngredientsChange([...selectedIngredients, newIngredient]);
  };

  const updateIngredient = (
    ingredientId: string,
    updates: Partial<IngredientItem>
  ) => {
    onIngredientsChange(
      selectedIngredients.map((ingredient) =>
        ingredient.id === ingredientId
          ? { ...ingredient, ...updates }
          : ingredient
      )
    );
  };

  const removeIngredient = (ingredientId: string) => {
    onIngredientsChange(
      selectedIngredients.filter((i) => i.id !== ingredientId)
    );
  };

  const handleQuantityChange = (ingredientId: string, value: number) => {
    updateIngredient(ingredientId, { quantity: value });
  };

  const handleUnitChange = (ingredientId: string, unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    updateIngredient(ingredientId, {
      unitId: unitId === "none" ? null : unitId,
      unitName: unitId === "none" ? null : unit?.name || null,
    });
  };

  return (
    <div className={className}>
      {/* Ingredient Search Input */}
      <div className="space-y-2">
        <FormLabel>Add Ingredients*</FormLabel>
        <Searchable
          options={availableIngredients
            .filter(
              (item) =>
                !selectedIngredients.some(
                  (selected) => selected.itemId === item.id
                )
            )
            .map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          placeholder="Search for ingredients..."
          emptyMessage={
            canCreateItems ? "No ingredients found" : "No ingredients found"
          }
          onSelect={handleIngredientSelect}
          value={searchValue}
          onValueChange={setSearchValue}
          showAddNew={canCreateItems}
          addNewLabel="Create new item"
          onAddNew={(searchText) => {
            setSearchValue(searchText || "");
            setShowCreateItemDialog(true);
          }}
          className="w-full"
        />
      </div>

      {/* Selected Ingredients List */}
      {selectedIngredients.length > 0 && (
        <div className="space-y-3 mt-6">
          <FormLabel>
            Selected Ingredients ({selectedIngredients.length})
          </FormLabel>
          <div className="space-y-2">
            {selectedIngredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
              >
                {/* Ingredient Name */}
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-900 truncate block text-sm">
                    {ingredient.itemName}
                  </span>
                </div>

                {/* Quantity Input */}
                <div className="flex-shrink-0">
                  <NumberInput
                    value={ingredient.quantity}
                    onChange={(value) =>
                      handleQuantityChange(ingredient.id, value)
                    }
                    min={0}
                    max={9999}
                    className="w-32"
                    editable={true}
                  />
                </div>

                {/* Unit Selector */}
                <div className="flex-shrink-0">
                  <Select
                    value={ingredient.unitId || "none"}
                    onValueChange={(value) =>
                      handleUnitChange(ingredient.id, value)
                    }
                  >
                    <SelectTrigger className="h-8 w-20 text-sm">
                      <SelectValue>
                        {ingredient.unitId === null ||
                        ingredient.unitId === "none"
                          ? "-"
                          : units.find((u) => u.id === ingredient.unitId)
                              ?.abbreviation || "-"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No unit</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient(ingredient.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Item Dialog */}
      <ItemDialog
        open={showCreateItemDialog}
        onOpenChange={setShowCreateItemDialog}
        onSuccess={() => {}} // No additional success handling needed
        onItemCreated={handleItemCreated}
        initialName={searchValue}
      />
    </div>
  );
}
