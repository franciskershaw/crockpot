"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Full-card skeleton matching Filters layout so content doesn’t jump when data loads.
 * Mirrors: header (title + clear), time range, category filter, ingredient filter.
 */
export default function FiltersSkeleton() {
  return (
    <Card
      className="border-0 sticky top-36 bg-white/80 backdrop-blur-sm shadow-lg overflow-auto p-0"
      style={{ maxHeight: "calc(100vh - 9rem)" }}
      aria-busy
      aria-label="Loading filters"
    >
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>

          {/* Time range block */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-full" />
          </div>

          {/* Categories block (with include/exclude + search + list) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-8 w-full" />
            <div className="space-y-1 rounded p-2 bg-gray-50/50 max-h-96 md:max-h-[28rem]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 shrink-0" />
                  <Skeleton
                    className="h-4 flex-1"
                    style={{ width: `${55 + (i % 3) * 15}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients block */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-full" />
            <div className="space-y-1 rounded p-2 bg-gray-50/50 max-h-96 md:max-h-[28rem]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 shrink-0" />
                  <Skeleton
                    className="h-4 flex-1"
                    style={{ width: `${50 + (i % 4) * 12}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
