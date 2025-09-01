import * as React from "react";
import { CheckIcon, Search, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export default function Searchable({
  options,
  placeholder = "Select an item",
  emptyMessage = "No items found",
  className,
  onSelect,
  value: controlledValue,
  onValueChange,
  showAddNew = false,
  addNewLabel = "Add new item",
  onAddNew,
}: {
  options: { value: string; label: string }[];
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  onSelect?: (value: string) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  showAddNew?: boolean;
  addNewLabel?: string;
  onAddNew?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onValueChange || setInternalValue;

  // Filter options based on search value
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  const handleSelect = (currentValue: string) => {
    // Find the option by label (currentValue) and get its value
    const selectedOption = options.find(
      (option) => option.label === currentValue
    );
    const newValue = selectedOption ? selectedOption.value : "";

    // Toggle if same option is selected
    const finalValue = newValue === value ? "" : newValue;
    setValue(finalValue);
    setOpen(false);
    onSelect?.(finalValue);
  };

  // Clear search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 px-3 py-2 text-sm",
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-full p-0 min-w-[200px] max-w-[400px]",
          "border border-input bg-popover text-popover-foreground shadow-md",
          className
        )}
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9 border-0 focus:ring-0"
          />
          <CommandList className="max-h-[200px] overflow-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>{emptyMessage}</p>
                {showAddNew && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      onAddNew?.();
                    }}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {addNewLabel}
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
