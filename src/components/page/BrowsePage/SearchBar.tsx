"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useFilters } from "./FilterProvider";
import { useCallback, useEffect, useRef } from "react";

const SearchBar = () => {
  const { filters, updateFilters } = useFilters();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedUpdateFilters = useCallback(
    (query: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        updateFilters({ query: query || undefined });
      }, 300);
    },
    [updateFilters]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedUpdateFilters(value);
  };

  return (
    <div className="flex-1 max-w-2xl">
      <div className="relative">
        <Search className="h-5 w-5 absolute left-4 top-3.5 z-50" />
        <Input
          placeholder="Search recipes by name..."
          className="pl-12 h-12 text-base bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full rounded"
          onChange={handleSearchChange}
          defaultValue={filters.query || ""}
          id="search-bar"
        />
      </div>
    </div>
  );
};

export default SearchBar;
