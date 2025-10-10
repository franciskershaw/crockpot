import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import { Card, CardContent } from "@/components/ui/card";

interface ServerSideSkeletonsProps {
  pageSize: number;
}

// Server-compatible skeleton matching the Skeleton component styles
function ServerSkeletonCard() {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 backdrop-blur-sm overflow-hidden w-full">
      <div className="relative h-48 overflow-hidden border">
        <div className="absolute inset-0 w-full h-full bg-accent animate-pulse rounded-md" />
      </div>
      
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          <div className="h-6 w-2/3 bg-accent animate-pulse rounded-md mt-3" />
          <div className="flex items-center gap-4 text-sm mb-5">
            <div className="h-4 w-16 bg-accent animate-pulse rounded-md" />
            <div className="h-4 w-16 bg-accent animate-pulse rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-5 w-16 bg-accent animate-pulse rounded-md" />
            <div className="h-5 w-12 bg-accent animate-pulse rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ServerSideSkeletons({ pageSize }: ServerSideSkeletonsProps) {
  return (
    <div className="recipe-skeletons">
      <ResponsiveRecipeGrid>
        {Array.from({ length: pageSize }).map((_, i) => (
          <div key={`server-skeleton-${i}`}>
            <ServerSkeletonCard />
          </div>
        ))}
      </ResponsiveRecipeGrid>
    </div>
  );
}
