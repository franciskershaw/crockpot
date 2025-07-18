"use server";

import { Badge } from "@/components/ui/badge";
import { getRecipes } from "@/actions";

export default async function Browse() {
  const recipes = await getRecipes({
    page: 1,
    pageSize: 10,
    query: "",
    categoryIds: [],
    approved: true,
  });
  console.log(recipes);
  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Desktop Sticky Header */}
        <div className="hidden md:block sticky top-16 z-40 bg-surface-warm/95 backdrop-blur-sm -mx-4 px-4 py-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 whitespace-nowrap">
                Browse Recipes
              </h1>
              <Badge
                variant="secondary"
                className="bg-surface-soft text-text-soft shrink-0"
              >
                {/* {filteredRecipes.length} recipes */}
              </Badge>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="md:col-span-3 lg:col-span-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"></div>
        </div>
      </div>
    </>
  );
}
