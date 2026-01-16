import { useState } from "react";
import { X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Unit, Item } from "@/data/types";

type AddItemEditorProps = {
  item: Item;
  onCancel: () => void;
  onConfirm: (quantity: number, unitId: string | null) => void;
  units: Unit[];
};

export function formatQty(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function AddItemEditor({
  item,
  onCancel,
  onConfirm,
  units,
}: AddItemEditorProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("none");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal points, but limit to 4 digits total
    if (value === "" || /^\d{0,4}(\.\d{0,2})?$/.test(value)) {
      setQuantity(value === "" ? 0 : parseFloat(value) || 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleConfirm = () => {
    const numericValue = parseFloat(quantity.toString());
    if (!isNaN(numericValue) && numericValue >= 0) {
      onConfirm(numericValue, selectedUnitId);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-b border-gray-200">
      <div className="flex items-center gap-1 flex-1">
        <span className="text-gray-800 text-sm">{item.name}</span>
        <span className="mx-1 text-gray-500">×</span>

        {/* Main control - mimics ShoppingListRowEditor */}
        <div className="relative">
          <div className="flex items-center h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
            {/* Cancel button (X) - left bookend */}
            <div className="flex items-center justify-center h-8 w-8">
              <button
                onClick={onCancel}
                className="flex items-center justify-center h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer rounded-full"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </button>
            </div>

            <div className="w-px h-4 bg-gray-300" />

            {/* Quantity input */}
            <div className="flex items-center px-2 relative">
              <Input
                type="text"
                value={quantity === 0 ? "" : formatQty(quantity)}
                onChange={handleQuantityChange}
                onKeyDown={handleKeyDown}
                className="text-sm font-medium text-gray-800 w-16 text-center px-2 bg-transparent border-none outline-none focus:ring-0 h-8"
                autoFocus
                maxLength={6}
              />
            </div>

            <div className="w-px h-4 bg-gray-300" />

            {/* Unit selector */}
            <div className="px-2">
              <Select
                value={selectedUnitId}
                onValueChange={(value) => setSelectedUnitId(value)}
              >
                <SelectTrigger className="h-8 max-w-24 text-sm bg-transparent border-none shadow-none focus:ring-0">
                  <SelectValue>
                    {selectedUnitId === "none"
                      ? "No unit"
                      : selectedUnitId &&
                        (() => {
                          const unit = units.find(
                            (u) => u.id === selectedUnitId
                          );
                          return unit?.abbreviation || "-";
                        })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No unit</SelectItem>
                  {item.allowedUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-px h-4 bg-gray-300" />

            {/* Confirm button (✓) - right bookend */}
            <div className="flex items-center justify-center h-8 w-8">
              <button
                onClick={handleConfirm}
                className="flex items-center justify-center h-8 w-8 text-green-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-colors cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItemEditor;
