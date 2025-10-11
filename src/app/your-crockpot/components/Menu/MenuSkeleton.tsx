import { ShoppingBasket } from "lucide-react";

export default function MenuSkeleton() {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-4">
      {/* Desktop Shopping List Skeleton */}
      <div className="hidden md:block col-span-1">
        <div className="w-full rounded-md border bg-white h-full flex flex-col">
          {/* Title section */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
            <ShoppingBasket className="h-6 w-6 text-gray-400 animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
          </div>

          {/* Search and buttons */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="h-10 w-full bg-gray-100 animate-pulse rounded-md" />
            <div className="flex gap-2">
              <div className="h-9 flex-1 bg-gray-100 animate-pulse rounded-md" />
              <div className="h-9 flex-1 bg-gray-100 animate-pulse rounded-md" />
            </div>
          </div>

          {/* Shopping list items */}
          <div className="flex-1 p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid Skeleton */}
      <div className="col-span-2">
        {/* Mobile buttons skeleton */}
        <div className="md:hidden mb-3 flex gap-2 justify-center">
          <div className="h-10 flex-1 max-w-48 bg-gray-200 animate-pulse rounded-md" />
          <div className="h-10 flex-1 bg-gray-200 animate-pulse rounded-md" />
        </div>

        {/* Recipe cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-gray-100 animate-pulse rounded" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-gray-100 animate-pulse rounded" />
                  <div className="h-6 w-16 bg-gray-100 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
