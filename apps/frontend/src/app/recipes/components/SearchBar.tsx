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
    <div className="flex-1 max-w-md md:max-w-sm">
      <div className="relative">
        <Input
          placeholder="Search recipes by name..."
          className="pr-10 pl-3 md:pl-4 h-10 md:h-12 text-sm md:text-base bg-white md:bg-white/80 md:backdrop-blur-sm border border-input md:border-0 shadow-sm md:shadow-lg w-full"
          onChange={handleSearchChange}
          value={searchValue}
          id={id || "search-bar"}
        />
        <Search className="absolute right-3 top-2.5 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-muted-foreground pointer-events-none" />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-9 md:right-10 top-1.5 md:top-2.5 h-7 w-7 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
