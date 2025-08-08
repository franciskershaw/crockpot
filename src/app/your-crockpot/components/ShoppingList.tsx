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
} from "@/hooks/useShoppingList";
import type { Item, ShoppingListWithDetails } from "@/data/types";
import ShoppingListRowEditor from "./ShopingListRowEditor";
import { SearchableSelect } from "@/components/ui/select";

interface ShoppingListProps {
  initialData?: ShoppingListWithDetails | null;
  items: Item[];
}

export default function ShoppingList({
  initialData,
  items,
}: ShoppingListProps) {
  const { data: shoppingList } = useGetShoppingList(initialData);
  const toggleObtained = useToggleObtainedMutation();
  const removeItem = useRemoveShoppingListItemMutation();
  const updateQuantity = useUpdateShoppingListItemQuantityMutation();

  const { grouped, categories, categoryIds } =
    useShoppingListCategories(shoppingList);

  return (
    <div className="w-full rounded-md border bg-white">
      {/* Title section */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 text-lg">
        <ShoppingBasket className="h-6 w-6 text-gray-600" />
        <h2 className="font-semibold text-gray-900">Shopping List</h2>
      </div>

      <SearchableSelect
        options={items.map((i) => ({
          value: i.id,
          label: i.name,
        }))}
      />

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
                            })
                          }
                          aria-label={
                            i.obtained ? "Mark not obtained" : "Mark obtained"
                          }
                          className="size-4"
                        />

                        <div className="flex-1 min-w-0 text-sm">
                          <ShoppingListRowEditor
                            label={i.item.name}
                            unitAbbr={i.unit?.abbreviation ?? ""}
                            struck={i.obtained}
                            quantity={i.quantity}
                            onCommit={(next) =>
                              updateQuantity.mutate({
                                itemId: i.itemId,
                                unitId: i.unitId ?? null,
                                quantity: next,
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
    </div>
  );
}
