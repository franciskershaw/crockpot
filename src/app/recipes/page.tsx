"use server";

import { Suspense } from "react";
import BrowseHeaderWithData from "./components/BrowseHeaderWithData";
import RecipeGrid from "./components/RecipeGrid";
import FiltersWithData from "./components/FiltersWithData";
import FilterProvider from "./context/FilterProvider";
import ServerSideSkeletons from "./components/ServerSideSkeletons";

export default async function Recipes() {
  return (
    <FilterProvider>
      <BrowseHeaderWithData />

      <div className="flex gap-6">
        <div className="hidden md:block w-80">
          <Suspense fallback={<FiltersSkeleton />}>
            <FiltersWithData />
          </Suspense>
        </div>

        <div className="flex-1 relative">
          <ServerSideSkeletons pageSize={9} />
          <RecipeGrid pageSize={9} />
        </div>
      </div>
    </FilterProvider>
  );
}

function FiltersSkeleton() {
  return (
    <div className="border-0 sticky top-36 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-accent animate-pulse rounded-md" />
          <div className="h-8 w-20 bg-accent animate-pulse rounded-md" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-accent animate-pulse rounded-md" />
          <div className="h-4 w-3/4 bg-accent animate-pulse rounded-md" />
          <div className="h-4 w-5/6 bg-accent animate-pulse rounded-md" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-accent animate-pulse rounded-md" />
          <div className="h-4 w-4/5 bg-accent animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
