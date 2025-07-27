"use client";

import {
  useAddToMenuMutation,
  useRemoveFromMenuMutation,
} from "@/hooks/useMenuMutations";
import { ShoppingCart, Check, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Recipe } from "@/data/types";

const AddToMenuButton = ({ recipe }: { recipe: Recipe }) => {
  const [menuState, setMenuState] = useState<"idle" | "editing" | "added">(
    "idle"
  );

  const [servingAmount, setServingAmount] = useState(recipe.serves || 4);

  const addToMenuMutation = useAddToMenuMutation();
  const removeFromMenuMutation = useRemoveFromMenuMutation();
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (menuState === "idle") {
      setMenuState("editing");
    } else if (menuState === "added") {
      removeFromMenuMutation.mutate({ recipeId: recipe.id });
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
    addToMenuMutation.mutate({ recipeId: recipe.id, serves: servingAmount });
  };

  const adjustAmount = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newAmount = Math.max(1, Math.min(20, servingAmount + delta));
    setServingAmount(newAmount);
  };
  return (
    <div className="flex items-center h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 overflow-hidden">
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
              disabled={removeFromMenuMutation.isPending}
              className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                {removeFromMenuMutation.isPending
                  ? "Removing from menu..."
                  : menuState === "added"
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

              {/* Number display or loading spinner */}
              <div className="text-sm font-medium text-gray-800 min-w-[2rem] text-center px-2 flex items-center justify-center">
                {addToMenuMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  servingAmount
                )}
              </div>

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
              disabled={addToMenuMutation.isPending}
              className="flex items-center justify-center h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">
                {addToMenuMutation.isPending ? "Adding..." : "Confirm amount"}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center relative">
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
    </div>
  );
};

export default AddToMenuButton;
