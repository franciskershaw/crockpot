export default function FavouritesSkeleton() {
  return (
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
  );
}
