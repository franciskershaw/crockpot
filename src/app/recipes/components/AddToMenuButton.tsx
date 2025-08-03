"use client";

import {
  useAddToMenuMutation,
  useRemoveFromMenuMutation,
} from "@/hooks/useMenu";
import { ShoppingCart, Check, X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect, useCallback, memo } from "react";
import { Recipe } from "@/data/types";
import { useGetMenu } from "@/hooks/useMenu";

const AddToMenuButton = memo(({ recipe }: { recipe: Recipe }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { menu } = useGetMenu();

  // Find if this recipe is in the menu
  const menuEntry = menu?.entries?.find(
    (entry) => entry.recipeId === recipe.id
  );
  const isInMenu = !!menuEntry;
  const menuServes = menuEntry?.serves || recipe.serves || 4;

  const [servingAmount, setServingAmount] = useState(menuServes);

  // Update serving amount when menu data changes
  useEffect(() => {
    setServingAmount(menuServes);
  }, [menuServes]);

  const addToMenuMutation = useAddToMenuMutation();
  const removeFromMenuMutation = useRemoveFromMenuMutation();

  const handleCartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(false);
      setServingAmount(menuServes); // Reset to current menu value
    },
    [menuServes]
  );

  const handleConfirmAmount = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addToMenuMutation.mutate(
        { recipeId: recipe.id, serves: servingAmount },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    },
    [recipe.id, servingAmount, addToMenuMutation]
  );

  const handleRemoveFromMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      removeFromMenuMutation.mutate(
        { recipeId: recipe.id },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    },
    [recipe.id, removeFromMenuMutation]
  );

  const adjustAmount = useCallback(
    (e: React.MouseEvent, delta: number) => {
      e.preventDefault();
      e.stopPropagation();
      const newAmount = Math.max(1, Math.min(20, servingAmount + delta));
      setServingAmount(newAmount);
    },
    [servingAmount]
  );

  return (
    <div className="relative">
      <div className="flex items-center h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
        <div className="flex items-center justify-center h-8 w-8">
          <AnimatePresence mode="wait">
            {isEditing ? (
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
                onClick={handleCartClick}
                className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                  isInMenu
                    ? "text-green-600 hover:text-green-700"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <ShoppingCart
                  className={`h-4 w-4 transition-all duration-200 ${
                    isInMenu ? "fill-current" : ""
                  }`}
                />
                <span className="sr-only">
                  {isInMenu ? "Edit menu item" : "Add to menu"}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Badge positioned to overlap top-right but be mostly outside */}
          <AnimatePresence>
            {isInMenu && !isEditing && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg border-2 border-white z-10 overflow-visible"
              >
                {menuServes}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Number input section - slides in from left after icon transition */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{
                width: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2, delay: 0.1 },
              }}
              className="flex items-center overflow-visible relative"
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
                transition={{ duration: 0.1 }}
                className="flex items-center px-2 relative"
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
                <div
                  className="text-sm font-medium text-gray-800 min-w-[2rem] text-center px-2 flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {addToMenuMutation.isPending ||
                  removeFromMenuMutation.isPending ? (
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

                {/* Remove from menu button - positioned to drop down from number input */}
                <AnimatePresence>
                  {isInMenu && isEditing && (
                    <motion.button
                      initial={{ y: -20, opacity: 0, scale: 0.9 }}
                      animate={{
                        y: 20,
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 0.25,
                          delay: 0.3,
                          ease: "easeOut",
                        },
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      onClick={handleRemoveFromMenu}
                      disabled={removeFromMenuMutation.isPending}
                      className="absolute top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full shadow-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-red-700 whitespace-nowrap z-10"
                    >
                      Remove from menu
                    </motion.button>
                  )}
                </AnimatePresence>
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
                disabled={
                  addToMenuMutation.isPending ||
                  removeFromMenuMutation.isPending
                }
                className="flex items-center justify-center h-8 w-8 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">
                  {addToMenuMutation.isPending ? "Adding..." : "Confirm amount"}
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

AddToMenuButton.displayName = "AddToMenuButton";

export default AddToMenuButton;
