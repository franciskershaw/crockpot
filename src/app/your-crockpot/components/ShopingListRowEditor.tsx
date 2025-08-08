import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";

type ShoppingListRowEditorProps = {
  label: string;
  unitAbbr: string;
  struck: boolean;
  quantity: number;
  step: number;
  onCommit: (nextQuantity: number) => void;
};

function formatQty(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function ShoppingListRowEditor({
  label,
  unitAbbr,
  struck,
  quantity,
  step,
  onCommit,
}: ShoppingListRowEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftQty, setDraftQty] = useState(quantity);

  useEffect(() => {
    setDraftQty(quantity);
  }, [quantity]);

  const dec = () =>
    setDraftQty((q) => Math.max(0, Math.round((q - step) * 100) / 100));
  const inc = () => setDraftQty((q) => Math.round((q + step) * 100) / 100);
  const cancel = () => {
    setDraftQty(quantity);
    setIsEditing(false);
  };
  const confirm = () => {
    onCommit(draftQty);
    setIsEditing(false);
  };

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1">
        <span
          className={struck ? "line-through text-gray-400" : "text-gray-800"}
        >
          {label}
        </span>
        <span className="mx-1 text-gray-500">×</span>
        {/* <span className="text-xs text-gray-600 ml-1">{unitAbbr}</span> */}

        {/* Morphing control – mirrors AddToMenuButton */}
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
                    onClick={cancel}
                    className="flex items-center justify-center h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer rounded-full"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </motion.button>
                ) : (
                  <motion.button
                    key="trigger"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center h-8 w-8 rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span>{quantity}</span>
                    <span className="sr-only">Adjust quantity</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

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

                  {/* Controls */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-center px-2 relative"
                  >
                    <button
                      onClick={dec}
                      disabled={draftQty <= 0}
                      className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold leading-none">−</span>
                    </button>
                    <div
                      className="text-sm font-medium text-gray-800 min-w-[2rem] text-center px-2 flex items-center justify-center"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {formatQty(draftQty)}
                    </div>
                    <button
                      onClick={inc}
                      className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
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

                  {/* Confirm */}
                  <motion.button
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    onClick={confirm}
                    className="flex items-center justify-center h-8 w-8 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Confirm</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.span
          className="text-xs text-gray-600 ml-1"
          animate={{ opacity: isEditing ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {unitAbbr}
        </motion.span>
      </div>
    </div>
  );
}

export default ShoppingListRowEditor;
