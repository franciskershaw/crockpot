import { Card, CardContent } from "@/components/ui/card";
import TimeRangeFilter from "./filters/TimeRangeFilter";
import CategoryFilter from "./filters/CategoryFilter";
import IngredientFilter from "./filters/IngredientFilter";
import {
  getRecipeCategories,
  getRecipeTimeRange,
  getRecipeIngredients,
} from "@/actions";

export default async function Filters() {
  const [categories, timeRange, ingredients] = await Promise.all([
    getRecipeCategories(),
    getRecipeTimeRange(),
    getRecipeIngredients(),
  ]);

  return (
    <Card className="sticky top-30 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Recipe Filters
          </h2>
          <TimeRangeFilter timeRange={timeRange} />
          <CategoryFilter categories={categories} />
          <IngredientFilter ingredients={ingredients} />
        </div>
      </CardContent>
    </Card>
  );
}
