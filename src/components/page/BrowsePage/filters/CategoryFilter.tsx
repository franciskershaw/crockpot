"use client";
import { useState, useMemo, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useFilters } from "../FilterProvider";
import type { RecipeCategory } from "@/data/types";

export default function CategoryFilter({
  categories = [],
}: {
  categories: RecipeCategory[];
}) {
  const { filters, updateFilters } = useFilters();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const displayCategories = showAll
    ? filteredCategories
    : filteredCategories.slice(0, 5);
  const hasMore = filteredCategories.length > 5;

  const selectedCategoryIds = filters.categoryIds || [];
  const categoryMode = filters.categoryMode || "include";

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
  }, [showAll, displayCategories.length]);

  // Reset scroll position when showAll changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setIsScrolledToBottom(false);
    }
  }, [showAll]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategoryIds = checked
      ? [...selectedCategoryIds, categoryId]
      : selectedCategoryIds.filter((id) => id !== categoryId);

    updateFilters({
      categoryIds: newCategoryIds,
    });
  };

  const handleModeChange = (mode: string) => {
    updateFilters({
      categoryMode: mode as "include" | "exclude",
    });
  };

  // Determine when to show fade:
  // 1. When not showing all items (!showAll && hasMore) - truncated list
  // 2. When showing all items but not scrolled to bottom (showAll && !isScrolledToBottom && hasMore)
  const shouldShowFade =
    (!showAll && hasMore) || (showAll && !isScrolledToBottom && hasMore);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">Categories</Label>

      {/* Include/Exclude Mode */}
      <RadioGroup
        value={categoryMode}
        onValueChange={handleModeChange}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="include" id="include" />
          <Label htmlFor="include" className="text-sm">
            Include
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="exclude" id="exclude" />
          <Label htmlFor="exclude" className="text-sm">
            Exclude
          </Label>
        </div>
      </RadioGroup>

      {/* Search within categories */}
      <div className="relative">
        <Search className="h-3 w-3 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Categories list with fade effect */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className={`space-y-2 max-h-48 overflow-y-auto ${
            shouldShowFade ? "mask-fade-bottom" : ""
          }`}
        >
          {displayCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategoryIds.includes(category.id)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.id, checked as boolean)
                }
                className="h-4 w-4"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-xs font-normal text-gray-600 cursor-pointer capitalize"
              >
                {category.name}
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
                Show All ({filteredCategories.length - 5} more)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
