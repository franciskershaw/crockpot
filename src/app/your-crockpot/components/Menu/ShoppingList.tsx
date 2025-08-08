"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getIconComponent } from "@/lib/icon-map";
import { Trash2, ShoppingBasket } from "lucide-react";
import {
  useRemoveShoppingListItemMutation,
  useToggleObtainedMutation,
  useUpdateShoppingListItemQuantityMutation,
  useShoppingListCategories,
  useGetShoppingList,
  useAddManualShoppingListItemMutation,
} from "@/hooks/useShoppingList";
import type {
  Item,
  RecipeMenu,
  ShoppingListWithDetails,
  Unit,
} from "@/data/types";
import ShoppingListRowEditor from "./ShopingListRowEditor";
import { useState } from "react";
import AddItemEditor from "./AddItemEditor";
import Searchable from "@/components/ui/searchable";
import ClearMenuDialog from "./ClearMenuDialog";
import ClearShoppingListDialog from "./ClearShoppingListDialog";

interface ShoppingListProps {
  initialData?: ShoppingListWithDetails | null;
  items: Item[];
  units: Unit[];
  menu?: RecipeMenu | null;
}

export default function ShoppingList({
  initialData,
  items,
  units,
  menu,
}: ShoppingListProps) {
  const { data: shoppingList } = useGetShoppingList(initialData);
  const toggleObtained = useToggleObtainedMutation();
  const removeItem = useRemoveShoppingListItemMutation();
  const updateQuantity = useUpdateShoppingListItemQuantityMutation();
  const addManualItem = useAddManualShoppingListItemMutation();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchableValue, setSearchableValue] = useState("");

  const { grouped, categories, categoryIds } = useShoppingListCategories(
    shoppingList,
    items
  );

  return (
    <div className="w-full rounded-md border bg-white h-full flex flex-col">
      {/* Title section */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 text-lg sticky top-0 bg-white z-10">
        <ShoppingBasket className="h-6 w-6 text-gray-600" />
        <h2 className="font-semibold text-gray-900">Shopping List</h2>
      </div>

      <div className="p-4 border-b border-gray-200 sticky top-[52px] bg-white z-10 flex flex-col gap-4">
        <Searchable
          options={items.map((i) => ({
            value: i.id,
            label: i.name,
          }))}
          placeholder="Add extra items..."
          emptyMessage="No items found"
          value={searchableValue}
          onValueChange={setSearchableValue}
          onSelect={(selectedValue) => {
            const selectedItem = items.find(
              (item) => item.id === selectedValue
            );
            if (selectedItem) {
              setSelectedItem(selectedItem);
              setSearchableValue("");
            }
          }}
          showAddNew={true}
          addNewLabel="Add new item"
          onAddNew={() => {
            console.log("Add new item clicked");
            // TODO: Open modal or navigate to add item page
          }}
          className="w-full"
        />
        <div className="flex gap-2">
          {[
            // Clear Menu button (if menu has entries)
            !menu?.entries || menu.entries.length === 0 ? null : (
              <div key="clear-menu" className="flex-1">
                <ClearMenuDialog />
              </div>
            ),
            // Clear Shopping List button (if shopping list has items)
            shoppingList?.items.length ? (
              <div key="clear-shopping-list" className="flex-1">
                <ClearShoppingListDialog />
              </div>
            ) : null,
          ].filter(Boolean)}
        </div>
      </div>

      {selectedItem && (
        <AddItemEditor
          item={selectedItem}
          onCancel={() => setSelectedItem(null)}
          units={units}
          onConfirm={(quantity, unitId) => {
            addManualItem.mutate({
              itemId: selectedItem.id,
              quantity,
              unitId: unitId && unitId !== "none" ? unitId : null,
            });
            setSelectedItem(null);
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        {shoppingList?.items.length === 0 ? (
          <div className="text-center text-gray-500 px-2 pt-2 pb-4">
            No items in shopping list
          </div>
        ) : (
          <Accordion type="multiple" className="w-full divide-y">
            {categoryIds.map((categoryId) => {
              const cat = categories[categoryId];
              const Icon = getIconComponent(cat.faIcon);
              const items = grouped[categoryId] || [];
              const obtainedCount = items.filter((i) => i.obtained).length;
              const total = items.length;
              const allObtained = total > 0 && obtainedCount === total;

              return (
                <AccordionItem key={categoryId} value={categoryId}>
                  <AccordionTrigger className="px-3">
                    <div className="flex items-center w-full gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{cat.name}</span>
                      <span
                        className={
                          "ml-auto text-xs " +
                          (allObtained
                            ? "text-green-600 font-medium"
                            : "text-gray-500")
                        }
                      >
                        {obtainedCount}/{total}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-2 py-1 space-y-1">
                      {items.map((i) => {
                        return (
                          <div
                            key={`${i.itemId}-${i.unitId ?? ""}`}
                            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
                          >
                            {/* Obtained toggle */}
                            <Checkbox
                              checked={i.obtained}
                              onCheckedChange={() =>
                                toggleObtained.mutate({
                                  itemId: i.itemId,
                                  unitId: i.unitId ?? null,
                                  isManual: i.isManual ?? false,
                                })
                              }
                              aria-label={
                                i.obtained
                                  ? "Mark not obtained"
                                  : "Mark obtained"
                              }
                              className="size-4"
                            />

                            <div className="flex-1 min-w-0 text-sm">
                              <ShoppingListRowEditor
                                label={
                                  (i as unknown as { displayLabel?: string })
                                    .displayLabel ??
                                  i.item?.name ??
                                  ""
                                }
                                unitAbbr={
                                  (i as unknown as { displayUnitAbbr?: string })
                                    .displayUnitAbbr ??
                                  i.unit?.abbreviation ??
                                  ""
                                }
                                struck={i.obtained}
                                quantity={i.quantity}
                                onCommit={(next) =>
                                  updateQuantity.mutate({
                                    itemId: i.itemId,
                                    unitId: i.unitId ?? null,
                                    quantity: next,
                                    isManual: i.isManual ?? false,
                                  })
                                }
                              />
                            </div>

                            {/* Remove */}
                            <Button
                              onClick={() =>
                                removeItem.mutate({
                                  itemId: i.itemId,
                                  unitId: i.unitId ?? null,
                                  isManual: i.isManual ?? false,
                                })
                              }
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-red-600 hover:text-red-700"
                              aria-label="Remove from shopping list"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
