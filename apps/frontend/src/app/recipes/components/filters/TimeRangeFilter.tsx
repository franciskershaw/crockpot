"use client";

// import { useCallback, useEffect, useRef, useState } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useFilters } from "@/app/recipes/context/FilterProvider";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import useGetTimeRange from "../../hooks/useGetTimeRange";

export default function TimeRangeFilter() {
  const { filters, updateFilters } = useFilters();

  const { data: timeRange, isLoading } = useGetTimeRange();

  const [localTimeRange, setLocalTimeRange] = useState<[number, number]>([
    filters.minTime ?? timeRange?.min,
    filters.maxTime ?? timeRange?.max,
  ]);

  // Update local state when filters change externally
  useEffect(() => {
    setLocalTimeRange([
      filters.minTime ?? timeRange?.min,
      filters.maxTime ?? timeRange?.max,
    ]);
  }, [filters.minTime, filters.maxTime, timeRange?.min, timeRange?.max]);

  // Debounced update function using useRef
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedUpdate = useCallback(
    (range: [number, number]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        updateFilters({
          minTime: range[0],
          maxTime: range[1],
        });
      }, 300);
    },
    [updateFilters]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSliderChange = (range: [number, number]) => {
    setLocalTimeRange(range);
    debouncedUpdate(range);
  };

  return (
    <div className="space-y-3">
      {isLoading ? (
        // Skeleton
        <>
          <div className="h-4 w-full" />
          <div className="h-4 w-full bg-accent animate-pulse rounded-md" />
        </>
      ) : (
        <>
          <Label className="text-sm font-medium text-gray-700">
            Cooking Time: {localTimeRange[0]}min - {localTimeRange[1]}min
          </Label>
          <Slider
            value={localTimeRange}
            onValueChange={handleSliderChange}
            min={timeRange?.min}
            max={timeRange?.max}
            step={5}
            className="w-full"
          />
        </>
      )}
    </div>
  );
}
