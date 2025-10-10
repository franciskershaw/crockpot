import * as React from "react";
import { CheckIcon, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./label";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  emptyIndicator?: string;
  maxSelections?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
  modal?: boolean;
}

export const Combobox = ({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  emptyIndicator = "No options found",
  maxSelections,
  label,
  disabled = false,
  className,
  popoverClassName,
  modal = false,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const isAtMaxSelections = maxSelections
    ? value.length >= maxSelections
    : false;

  // Filter options based on search value
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  // Get option by value
  const getOptionByValue = React.useCallback(
    (optionValue: string) =>
      options.find((option) => option.value === optionValue),
    [options]
  );

  // Handle option selection/deselection
  const handleOptionToggle = React.useCallback(
    (optionValue: string) => {
      if (disabled) return;

      const option = getOptionByValue(optionValue);
      if (option?.disabled) return;

      const isSelected = value.includes(optionValue);

      if (isSelected) {
        // Remove option
        const newValue = value.filter((v) => v !== optionValue);
        onValueChange?.(newValue);
      } else {
        // Add option (respect max limit)
        if (isAtMaxSelections) return;
        const newValue = [...value, optionValue];
        onValueChange?.(newValue);
      }
    },
    [value, onValueChange, disabled, getOptionByValue, isAtMaxSelections]
  );

  // Handle badge removal
  const handleBadgeRemove = React.useCallback(
    (optionValue: string) => {
      if (disabled) return;
      const newValue = value.filter((v) => v !== optionValue);
      onValueChange?.(newValue);
    },
    [value, onValueChange, disabled]
  );

  // Clear search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen} modal={modal}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between h-auto min-h-10 px-3 py-2 text-sm overflow-hidden",
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <div className="flex flex-1 items-center gap-1 min-w-0 overflow-hidden">
              {value.length > 0 ? (
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1 min-w-0 max-w-full">
                  {value.map((optionValue) => {
                    const option = getOptionByValue(optionValue);
                    if (!option) return null;

                    return (
                      <Badge
                        key={optionValue}
                        variant="secondary"
                        className="flex-shrink-0 gap-1 pr-1 whitespace-nowrap"
                      >
                        <span className="truncate max-w-[80px]">
                          {option.label}
                        </span>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBadgeRemove(optionValue);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              handleBadgeRemove(optionValue);
                            }
                          }}
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-black/10"
                          aria-label={`Remove ${option.label}`}
                        >
                          <X className="h-3 w-3" />
                        </div>
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <span className="text-muted-foreground truncate">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-[var(--radix-popover-trigger-width)] p-0 min-w-[200px] max-w-[400px]",
            popoverClassName
          )}
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search options..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList className="max-h-[200px] overflow-auto">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {emptyIndicator}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isDisabled =
                    option.disabled || (!isSelected && isAtMaxSelections);

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleOptionToggle(option.value)}
                      disabled={isDisabled}
                      className={cn(
                        "cursor-pointer",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      <span className="truncate">{option.label}</span>
                      {!isSelected && isAtMaxSelections && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          Max reached
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {maxSelections && (
        <div className="text-xs text-muted-foreground">
          {value.length} of {maxSelections} selected
        </div>
      )}
    </div>
  );
};
