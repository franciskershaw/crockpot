"use client";

import { useState } from "react";

import { ShoppingBasket, Trash2 } from "lucide-react";

import useItems from "@/app/items/useItems";
import useGetMenu from "@/app/menu/hooks/useGetMenu";
import useAddManualShoppingListItem from "@/app/shopping-list/hooks/useAddManualShoppingListItem";
import useGetShoppingList from "@/app/shopping-list/hooks/useGetShoppingList";
import useRemoveShoppingListItem from "@/app/shopping-list/hooks/useRemoveShoppingListItem";
import useToggleObtained from "@/app/shopping-list/hooks/useToggleObtained";
import useUpdateShoppingListItemQuantity from "@/app/shopping-list/hooks/useUpdateShoppingListItemQuantity";
// import ItemDialog from "@/components/dialogs/ItemDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Searchable from "@/components/ui/searchable";
import useUser from "@/hooks/user/useUser";
import { getIconComponent } from "@/lib/icon-map";
import { hasPermission } from "@/lib/utils";
import type { Item, ShoppingListItem } from "@/shared/types";
import { Permission } from "@/shared/types";

import AddItemEditor from "./AddItemEditor";
import ClearMenuDialog from "./ClearMenuDialog";
import ClearShoppingListDialog from "./ClearShoppingListDialog";
import ShoppingListRowEditor from "./ShopingListRowEditor";

export default function ShoppingList() {
  const { shoppingList, grouped, categories, categoryIds } =
    useGetShoppingList();

  const { menu } = useGetMenu();
  const { items } = useItems("all");
  const toggleObtained = useToggleObtained();
  const removeItem = useRemoveShoppingListItem();
  const updateQuantity = useUpdateShoppingListItemQuantity();
  const addManualItem = useAddManualShoppingListItem();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchableValue, setSearchableValue] = useState("");
  const [showCreateItemDialog, setShowCreateItemDialog] = useState(false);

  const { user } = useUser();

  const canCreateItems =
    user && hasPermission(user.role, Permission.CREATE_ITEMS);

  const handleItemCreated = (newItem: Item) => {
    // Close the dialog
    setShowCreateItemDialog(false);

    // Automatically select the newly created item for pre-confirmation
    setSelectedItem(newItem);
  };

  return (
    <div className="w-full rounded-md border bg-white h-full flex flex-col">
      {/* Title section */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 text-lg sticky top-0 bg-white z-10">
        <ShoppingBasket className="h-6 w-6 text-gray-600" />
        <h2 className="font-semibold text-gray-900">Shopping List</h2>
      </div>

      <div className="p-4 border-b border-gray-200 sticky top-[52px] bg-white z-10 flex flex-col">
        <Searchable
          options={items?.map((i: Item) => ({
            value: i._id,
            label: i.name,
          }))}
          placeholder="Add extra items..."
          emptyMessage="No items found"
          value={searchableValue}
          onValueChange={setSearchableValue}
          onSelect={(selectedValue) => {
            const selectedItem = items?.find(
              (item: Item) => item._id === selectedValue
            );
            if (selectedItem) {
              setSelectedItem(selectedItem);
              setSearchableValue("");
            }
          }}
          showAddNew={canCreateItems}
          addNewLabel="Add new item"
          onAddNew={(searchText) => {
            setSearchableValue(searchText || "");
            setShowCreateItemDialog(true);
          }}
          className="w-full"
        />
        <div className="flex gap-2">
          {[
            // Clear Menu button (if menu has entries)
            !menu?.entries || menu.entries.length === 0 ? null : (
              <div key="clear-menu" className="flex-1 mt-4">
                <ClearMenuDialog />
              </div>
            ),
            // Clear Shopping List button (if shopping list has items)
            shoppingList?.items.length ? (
              <div key="clear-shopping-list" className="flex-1 mt-4">
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
          onConfirm={(quantity, unitId) => {
            addManualItem.mutate({
              itemId: selectedItem._id,
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
                      {items.map((i: ShoppingListItem) => {
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
                                    unitId: i.unit._id ?? null,
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
                                  unitId: i.unit._id ?? null,
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

      {/* Create Item Dialog */}
      {/* <ItemDialog
        open={showCreateItemDialog}
        onOpenChange={setShowCreateItemDialog}
        onSuccess={() => {}} // No additional success handling needed
        onItemCreated={handleItemCreated}
        initialName={searchableValue}
      /> */}
    </div>
  );
}
