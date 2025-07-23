"use client";

import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Check, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Recipe } from "@/data/types";

interface RecipeActionsProps {
  recipe: Recipe;
}

export default function RecipeActions({ recipe }: RecipeActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [menuState, setMenuState] = useState<"idle" | "editing" | "added">(
    "idle"
  );
  const [servingAmount, setServingAmount] = useState(recipe.serves || 4);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: Add server action to update favorites
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (menuState === "idle") {
      setMenuState("editing");
    } else if (menuState === "added") {
      // Remove from menu
      setMenuState("idle");
      setServingAmount(recipe.serves || 4);
      // TODO: Add server action to remove from menu
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuState("idle");
    setServingAmount(recipe.serves || 4);
  };

  const handleConfirmAmount = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuState("added");
    // TODO: Add server action to add recipe to menu with servingAmount
  };

  const adjustAmount = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newAmount = Math.max(1, Math.min(20, servingAmount + delta));
    setServingAmount(newAmount);
  };

  return (
    <div className="flex items-center justify-between h-8">
      {/* Shopping cart section with coordinated animations */}
      <div className="flex items-center relative">
        <div className="flex items-center h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 overflow-hidden">
          {/* Base button (cart/X) - always present */}
          <div className="flex items-center justify-center h-8 w-8">
            <AnimatePresence mode="wait">
              {menuState === "editing" ? (
                <motion.button
                  key="cancel"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleCancel}
                  className="flex items-center justify-center h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </motion.button>
              ) : (
                <motion.button
                  key="cart"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleMenuClick}
                  className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                    menuState === "added"
                      ? "text-green-600 hover:text-green-700"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <ShoppingCart
                    className={`h-4 w-4 transition-all duration-200 ${
                      menuState === "added" ? "fill-current" : ""
                    }`}
                  />
                  <span className="sr-only">
                    {menuState === "added"
                      ? `Added to menu (${servingAmount} servings) - click to remove`
                      : "Add to menu"}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Number input section - slides in from left after icon transition */}
          <AnimatePresence>
            {menuState === "editing" && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{
                  width: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2, delay: 0.1 },
                }}
                className="flex items-center overflow-hidden"
              >
                {/* Separator */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.15, delay: 0.1 }}
                  className="w-px h-4 bg-gray-300"
                />

                {/* Number picker controls */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  className="flex items-center px-2"
                >
                  {/* Minus button */}
                  <button
                    onClick={(e) => adjustAmount(e, -1)}
                    disabled={servingAmount <= 1}
                    className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold leading-none">−</span>
                  </button>

                  {/* Number display */}
                  <span className="text-sm font-medium text-gray-800 min-w-[2rem] text-center px-2">
                    {servingAmount}
                  </span>

                  {/* Plus button */}
                  <button
                    onClick={(e) => adjustAmount(e, 1)}
                    disabled={servingAmount >= 20}
                    className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold leading-none">+</span>
                  </button>
                </motion.div>

                {/* Separator */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.15, delay: 0.1 }}
                  className="w-px h-4 bg-gray-300"
                />

                {/* Confirm button */}
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                  onClick={handleConfirmAmount}
                  className="flex items-center justify-center h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Confirm amount</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Serving amount badge when added */}
        <AnimatePresence>
          {menuState === "added" && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="ml-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm"
            >
              {servingAmount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Heart button with circular background - far right */}
      <Button
        size="sm"
        variant="ghost"
        className={`h-8 w-8 p-0 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 ${
          isFavorited
            ? "text-red-500 hover:text-red-600"
            : "text-gray-600 hover:text-red-500"
        }`}
        onClick={handleFavoriteClick}
      >
        <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        <span className="sr-only">
          {isFavorited ? "Remove from favorites" : "Add to favorites"}
        </span>
      </Button>
    </div>
  );
}
