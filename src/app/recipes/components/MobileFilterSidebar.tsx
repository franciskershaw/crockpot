"use client";

import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import SearchBar from "./SearchBar";
import TimeRangeFilter from "./filters/TimeRangeFilter";
import CategoryFilter from "./filters/CategoryFilter";
import IngredientFilter from "./filters/IngredientFilter";
import ClearFiltersButton from "./ClearFiltersButton";
import RecipeCountBadge from "./RecipeCountBadge";
import type { RecipeCategory, Item } from "@/data/types";

interface MobileFilterSidebarProps {
  categories: RecipeCategory[];
  timeRange: { min: number; max: number };
  ingredients: Item[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileFilterSidebar({
  categories,
  timeRange,
  ingredients,
  isOpen,
  onClose,
}: MobileFilterSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const focusable = sidebar.querySelectorAll<HTMLElement>(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    sidebar.addEventListener("keydown", handleKeyDown);
    return () => sidebar.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Sidebar (full screen) - Higher z-index than navbar */}
      <div
        ref={sidebarRef}
        tabIndex={isOpen ? 0 : -1}
        className={`fixed inset-0 h-full w-full bg-white z-[60] transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-modal="true"
        role="dialog"
        style={{ outline: "none" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-800">
                Search & Filter
              </h2>
              <RecipeCountBadge />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full focus:outline-none"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {/* Search Section - No heading, search bar is first */}
            <div className="p-6 border-b">
              <SearchBar />
            </div>

            {/* Filters Section */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Filter Options
                </h3>
                <ClearFiltersButton />
              </div>
              <TimeRangeFilter timeRange={timeRange} />
              <CategoryFilter categories={categories} />
              <IngredientFilter ingredients={ingredients} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
