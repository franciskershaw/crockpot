import { Card, CardContent } from "@/components/ui/card";
import TimeRangeFilter from "./filters/TimeRangeFilter";
import CategoryFilter from "./filters/CategoryFilter";
import IngredientFilter from "./filters/IngredientFilter";
import ClearFiltersButton from "./ClearFiltersButton";
import type { RecipeCategory, Item } from "@/data/types";

export default function Filters({
  categories,
  timeRange,
  ingredients,
}: {
  categories: RecipeCategory[];
  timeRange: { min: number; max: number };
  ingredients: Item[];
}) {
  return (
    <Card
      className="border-0 sticky top-36 bg-white/80 backdrop-blur-sm shadow-lg overflow-auto p-0"
      style={{ maxHeight: "calc(100vh - 9rem)" }}
    >
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Recipe Filters
            </h2>
            <ClearFiltersButton />
          </div>
          <TimeRangeFilter timeRange={timeRange} />
          <CategoryFilter categories={categories} />
          <IngredientFilter ingredients={ingredients} />
        </div>
      </CardContent>
    </Card>
  );
}
