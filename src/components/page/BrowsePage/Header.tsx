import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const BrowseHeader = () => {
  return (
    <div className="sticky top-16 z-40 bg-surface-warm/95 backdrop-blur-sm -mx-4 px-4 py-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold whitespace-nowrap">
            Browse Recipes
          </h1>
        </div>
        {/* Desktop Search Bar - on same row as header */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" />
            <Input
              placeholder="Search recipes by name..."
              className="pl-12 h-12 text-base bg-white/80 backdrop-blur-sm border-0 shadow-lg w-full rounded"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseHeader;
