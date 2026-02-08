import { Card, CardContent } from "@/components/ui/card";

import CategoryFilter from "./filters/CategoryFilter";
import IngredientFilter from "./filters/IngredientFilter";
import TimeRangeFilter from "./filters/TimeRangeFilter";
import ClearFiltersButton from "./ClearFiltersButton";

export default function Filters() {
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
          <TimeRangeFilter />
          <CategoryFilter />
          <IngredientFilter />
        </div>
      </CardContent>
    </Card>
  );
}
