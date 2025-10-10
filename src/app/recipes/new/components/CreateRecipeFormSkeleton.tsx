import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateRecipeFormSkeleton() {
  return (
    <Card className="pb-0">
      <CardContent className="space-y-6 md:space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
      </CardContent>
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 shadow-lg rounded-b-lg">
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </div>
    </Card>
  );
}
