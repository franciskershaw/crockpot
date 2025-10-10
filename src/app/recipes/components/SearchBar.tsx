"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useFilters } from "@/app/recipes/context/FilterProvider";
import { useCallback, useEffect, useRef, useState } from "react";

const SearchBar = ({ id }: { id?: string }) => {
  const { filters, updateFilters } = useFilters();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [searchValue, setSearchValue] = useState(filters.query || "");

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

  // Sync search value with filters when they change externally
  useEffect(() => {
    setSearchValue(filters.query || "");
  }, [filters.query]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedUpdateFilters(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    updateFilters({ query: undefined });
  };

  return (
    <div className="flex-1 max-w-2xl">
      <div className="relative">
        <Search className="h-5 w-5 absolute left-4 top-3.5 z-50" />
        <Input
          placeholder="Search recipes by name..."
          className="pl-12 h-12 text-base bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full rounded"
          onChange={handleSearchChange}
          value={searchValue}
          id={id || "search-bar"}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-2.5 h-7 w-7 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
