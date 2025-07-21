"use client";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useFilters } from "../../context/FilterProvider";
import { useCallback, useEffect, useRef, useState } from "react";

export default function TimeRangeFilter({
  timeRange,
}: {
  timeRange: { min: number; max: number };
}) {
  const { filters, updateFilters } = useFilters();
  const [localTimeRange, setLocalTimeRange] = useState<[number, number]>([
    filters.minTime ?? timeRange.min,
    filters.maxTime ?? timeRange.max,
  ]);

  // Update local state when filters change externally
  useEffect(() => {
    setLocalTimeRange([
      filters.minTime ?? timeRange.min,
      filters.maxTime ?? timeRange.max,
    ]);
  }, [filters.minTime, filters.maxTime, timeRange.min, timeRange.max]);

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
    setLocalTimeRange(range); // Update local state immediately for smooth UI
    debouncedUpdate(range); // Debounced update to filters
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        Cooking Time: {localTimeRange[0]}min - {localTimeRange[1]}min
      </Label>
      <Slider
        value={localTimeRange}
        onValueChange={handleSliderChange}
        max={timeRange.max}
        min={timeRange.min}
        step={5}
        className="w-full"
      />
    </div>
  );
}
