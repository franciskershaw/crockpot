"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const displayOptions = showAll
    ? filteredOptions
    : filteredOptions.slice(0, 5);
  const hasMore = filteredOptions.length > 5;

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
  }, [showAll, displayOptions.length]);

  // Reset scroll position when showAll changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setIsScrolledToBottom(false);
    }
  }, [showAll]);

  // Determine when to show fade:
  // 1. When not showing all items (!showAll && hasMore) - truncated list
  // 2. When showing all items but not scrolled to bottom (showAll && !isScrolledToBottom && hasMore)
  const shouldShowFade =
    (!showAll && hasMore) || (showAll && !isScrolledToBottom && hasMore);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

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

      {/* Options list with fade effect */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className={`space-y-2 max-h-48 overflow-y-auto ${
            shouldShowFade ? "mask-fade-bottom" : ""
          }`}
        >
          {displayOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
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
          ))}
        </div>

        {/* Show/Hide toggle */}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-2 h-6 text-xs text-brand-primary hover:text-brand-tertiary"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show All ({filteredOptions.length - 5} more)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
