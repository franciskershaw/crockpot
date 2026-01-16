"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  editable?: boolean;
  className?: string;
}

const NumberInput = ({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  label,
  icon: Icon,
  disabled = false,
  editable = true,
  className,
  ref,
}: NumberInputProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);

  // Update internal input value when prop value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const adjustValue = (delta: number) => {
    if (disabled) return;

    const newValue = Math.max(min, Math.min(max, value + delta * step));
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    setInputValue(newValue);
  };

  const handleInputConfirm = () => {
    // Round to nearest step boundary
    const alignedValue = Math.round(inputValue / step) * step;
    const finalValue = Math.max(min, Math.min(max, alignedValue));
    onChange(finalValue);
    setIsEditing(false);
  };

  const handleInputCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center space-y-2", className)}
    >
      {/* Label with icon */}
      {(label || Icon) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {Icon && <Icon className="h-4 w-4" />}
          {label && <span>{label}</span>}
        </div>
      )}

      {/* Number input control */}
      <div className="flex items-center h-8 bg-background/95 backdrop-blur-sm rounded-full shadow-sm border border-border">
        {/* Decrease button */}
        <button
          type="button"
          onClick={() => adjustValue(-1)}
          disabled={!canDecrease}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            !canDecrease && "opacity-50 cursor-not-allowed"
          )}
          aria-label={`Decrease ${label || "value"}`}
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Value display/input */}
        {isEditing && editable ? (
          <div className="flex items-center px-2">
            <Input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInputConfirm();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  handleInputCancel();
                }
              }}
              className="w-12 h-6 text-center text-sm bg-transparent border-none focus:ring-0 p-0"
              autoFocus
              min={min}
              max={max}
              step={step}
            />
          </div>
        ) : (
          <div
            className={cn(
              "px-4 py-2 text-center min-w-[3rem]",
              editable &&
                !disabled &&
                "cursor-pointer hover:bg-accent/50 transition-colors"
            )}
            onClick={() => {
              if (editable && !disabled) {
                setInputValue(value);
                setIsEditing(true);
              }
            }}
            role={editable ? "button" : undefined}
            tabIndex={editable && !disabled ? 0 : undefined}
            onKeyDown={(e) => {
              if (
                editable &&
                !disabled &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                setInputValue(value);
                setIsEditing(true);
              }
            }}
            aria-label={
              editable
                ? `Edit ${label || "value"}, current value is ${value}`
                : undefined
            }
          >
            <span className="text-sm font-medium text-foreground">{value}</span>
          </div>
        )}

        {/* Increase button */}
        <button
          type="button"
          onClick={() => adjustValue(1)}
          disabled={!canIncrease}
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-full transition-colors",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
            !canIncrease && "opacity-50 cursor-not-allowed"
          )}
          aria-label={`Increase ${label || "value"}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

NumberInput.displayName = "NumberInput";

export { NumberInput };
