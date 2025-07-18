import { Card, CardContent } from "@/components/ui/card";
import TimeRangeFilter from "./filters/TimeRangeFilter";
import CategoryFilter from "./filters/CategoryFilter";

export default function Filters() {
  return (
    <Card className="sticky top-32 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Recipe Filters
          </h2>
          <TimeRangeFilter />
          <CategoryFilter />
        </div>
      </CardContent>
    </Card>
  );
}
