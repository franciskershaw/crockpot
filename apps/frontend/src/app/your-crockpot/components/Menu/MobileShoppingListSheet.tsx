"use client";

import { ShoppingBasket } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Item, Unit } from "@/shared/types";

import ShoppingList from "./ShoppingList";

type MobileShoppingListSheetProps = {
  items: Item[];
  units: Unit[];
};

export default function MobileShoppingListSheet({
  items,
  units,
}: MobileShoppingListSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open shopping list"
          className="bg-brand-primary text-white w-full"
        >
          Shopping list
          <ShoppingBasket className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-dvh p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Shopping List</SheetTitle>
          <SheetDescription>Manage items to buy</SheetDescription>
        </SheetHeader>
        {/* Visible close control on mobile */}
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close shopping list"
            className="absolute right-2 top-2 z-50 md:hidden"
          >
            <span className="sr-only">Close</span>✕
          </Button>
        </SheetClose>
        <div className="h-full">
          <ShoppingList items={items} units={units} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
