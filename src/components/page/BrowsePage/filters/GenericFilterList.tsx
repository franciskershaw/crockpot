"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";

interface GenericFilterListProps {
  label: string;
  options: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (id: string, checked: boolean) => void;
  showIncludeExclude?: boolean;
  includeExcludeValue?: "include" | "exclude";
  onIncludeExcludeChange?: (mode: "include" | "exclude") => void;
}

export default function GenericFilterList({
  label,
  options,
  selectedIds,
  onChange,
  showIncludeExclude = false,
  includeExcludeValue = "include",
  onIncludeExcludeChange,
}: GenericFilterListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const initialVisibleItems = 6;
  const hasMore = filteredOptions.length > initialVisibleItems;

  // Handle scroll to detect if user has scrolled to bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px tolerance
      setIsScrolledToBottom(isAtBottom);
    };

    // Check initial state
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [showAll, filteredOptions.length]);

  // Check if content overflows and requires scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      const { scrollHeight, clientHeight } = container;
      setHasOverflow(scrollHeight > clientHeight);
    };

    // Check overflow after a brief delay to ensure DOM is updated
    const timeoutId = setTimeout(checkOverflow, 0);
    return () => clearTimeout(timeoutId);
  }, [showAll, filteredOptions.length]);

  // Reset scroll position when showAll changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setIsScrolledToBottom(false);
    }
  }, [showAll]);

  // Determine when to show fade:
  // 1. When not showing all items (!showAll && hasMore) - truncated list
  // 2. When showing all items but not scrolled to bottom AND content overflows (showAll && !isScrolledToBottom && hasMore && hasOverflow)
  const shouldShowFade =
    (!showAll && hasMore) ||
    (showAll && !isScrolledToBottom && hasMore && hasOverflow);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="h-auto p-0 text-xs text-brand-primary hover:text-brand-tertiary"
          >
            {showAll
              ? "Hide"
              : `Show All (${
                  filteredOptions.length - initialVisibleItems
                } more)`}
          </Button>
        )}
      </div>

      {/* Include/Exclude Mode */}
      {showIncludeExclude && onIncludeExcludeChange && (
        <RadioGroup
          value={includeExcludeValue}
          onValueChange={(value) =>
            onIncludeExcludeChange(value as "include" | "exclude")
          }
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="include" id={`${label}-include`} />
            <Label htmlFor={`${label}-include`} className="text-sm">
              Include
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="exclude" id={`${label}-exclude`} />
            <Label htmlFor={`${label}-exclude`} className="text-sm">
              Exclude
            </Label>
          </div>
        </RadioGroup>
      )}

      {/* Search within options */}
      <div className="relative">
        <Search className="h-3 w-3 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder={`Search ${label.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Options list */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className={`space-y-1 overflow-y-auto max-h-96 md:max-h-[28rem] bg-gray-50/50 rounded p-2 ${
            shouldShowFade ? "mask-fade-bottom" : ""
          }`}
        >
          {filteredOptions.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-2">
              0 results
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.id}
                className={
                  index >= initialVisibleItems && !showAll ? "hidden" : ""
                }
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${label}-${option.id}`}
                    checked={selectedIds.includes(option.id)}
                    onCheckedChange={(checked) =>
                      onChange(option.id, checked as boolean)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={`${label}-${option.id}`}
                    className="text-xs font-normal text-gray-600 cursor-pointer capitalize"
                  >
                    {option.name}
                  </Label>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
