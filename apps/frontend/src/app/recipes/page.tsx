import type { Metadata } from "next";

import Filters from "./components/Filters";
import BrowseHeader from "./components/Header";
import RecipeGrid from "./components/RecipeGrid";
import FilterProvider from "./context/FilterProvider";

export const metadata: Metadata = {
  title: "Browse Recipes",
  description:
    "Explore our extensive collection of delicious recipes. Filter by category, ingredients, cooking time, and more. Find your next favorite dish from our curated recipe library.",
  openGraph: {
    title: "Browse Recipes | Crockpot",
    description:
      "Explore our extensive collection of delicious recipes. Filter by category, ingredients, and cooking time to find your perfect meal.",
    type: "website",
  },
};

export default async function Recipes() {
  return (
    <FilterProvider>
      <BrowseHeader />

      <div className="flex gap-6">
        <div className="hidden md:block w-80">
          <Filters />
        </div>

        <div className="flex-1 relative">
          <RecipeGrid pageSize={9} />
        </div>
      </div>
    </FilterProvider>
  );
}
