"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useFilters } from "@/app/recipes/context/FilterProvider";
import type { RecipeCategory, Item } from "@/data/types";
import { useState, useEffect, useRef, useMemo } from "react";

interface ActiveFilterBadgesProps {
  categories: RecipeCategory[];
  ingredients: Item[];
}

type BadgeType = "category" | "ingredient" | "time";

interface BadgeConfig {
  key: string;
  label: string;
  colorClasses: string;
  onRemove: () => void;
}

const getBadgeColorClasses = (type: BadgeType): string => {
  switch (type) {
    case "category":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200";
    case "ingredient":
      return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
    case "time":
      return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
  }
};

export default function ActiveFilterBadges({
  categories,
  ingredients,
}: ActiveFilterBadgesProps) {
  const { filters, updateFilters } = useFilters();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const filterBadges = useMemo((): BadgeConfig[] => {
    const badges: BadgeConfig[] = [];

    // Time range filter
    if (filters.minTime !== undefined || filters.maxTime !== undefined) {
      const minLabel =
        filters.minTime !== undefined ? `${filters.minTime}` : "0";
      const maxLabel =
        filters.maxTime !== undefined ? `${filters.maxTime}` : "∞";
      badges.push({
        key: "time",
        label: `Time: ${minLabel}-${maxLabel} min`,
        colorClasses: getBadgeColorClasses("time"),
        onRemove: () =>
          updateFilters({ minTime: undefined, maxTime: undefined }),
      });
    }

    // Category filters
    filters.categoryIds?.forEach((categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        const modePrefix = filters.categoryMode === "exclude" ? "Not " : "";
        badges.push({
          key: `category-${categoryId}`,
          label: `${modePrefix}${category.name}`,
          colorClasses: getBadgeColorClasses("category"),
          onRemove: () =>
            updateFilters({
              categoryIds: filters.categoryIds?.filter(
                (id) => id !== categoryId
              ),
            }),
        });
      }
    });

    // Ingredient filters
    filters.ingredientIds?.forEach((ingredientId) => {
      const ingredient = ingredients.find((i) => i.id === ingredientId);
      if (ingredient) {
        badges.push({
          key: `ingredient-${ingredientId}`,
          label: ingredient.name,
          colorClasses: getBadgeColorClasses("ingredient"),
          onRemove: () =>
            updateFilters({
              ingredientIds: filters.ingredientIds?.filter(
                (id) => id !== ingredientId
              ),
            }),
        });
      }
    });

    return badges;
  }, [filters, categories, ingredients, updateFilters]);

  // Combined effect to check scroll position and overflow
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScrollAndOverflow = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; // 5px tolerance
      const hasOverflowNow = scrollWidth > clientWidth;

      setIsScrolledToEnd(isAtEnd);
      setHasOverflow(hasOverflowNow);
    };

    // Check initial state after a brief delay to ensure DOM is ready
    const initialCheckTimeout = setTimeout(checkScrollAndOverflow, 0);

    // Add scroll listener
    container.addEventListener("scroll", checkScrollAndOverflow);

    // Add resize observer to recheck on container size changes
    const resizeObserver = new ResizeObserver(checkScrollAndOverflow);
    resizeObserver.observe(container);

    return () => {
      clearTimeout(initialCheckTimeout);
      container.removeEventListener("scroll", checkScrollAndOverflow);
      resizeObserver.disconnect();
    };
  }, [filterBadges.length]);

  const shouldShowFade = hasOverflow && !isScrolledToEnd;

  if (filterBadges.length === 0) {
    return null;
  }

  return (
    <div className="relative flex items-center min-h-[40px]">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full"
      >
        {filterBadges.map((badge) => (
          <Badge
            key={badge.key}
            onClick={badge.onRemove}
            className={`${badge.colorClasses} cursor-pointer transition-colors pl-3 pr-2 py-1.5 text-sm whitespace-nowrap flex items-center gap-1.5 shrink-0`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                badge.onRemove();
              }
            }}
            aria-label={`Remove ${badge.label} filter`}
          >
            <span>{badge.label}</span>
            <X className="h-3 w-3 pointer-events-none" />
          </Badge>
        ))}
      </div>
      {shouldShowFade && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-warm/95 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
