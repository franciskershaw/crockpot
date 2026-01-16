import { Button } from "@/components/ui/button";
import EmptyStateWithBackground from "@/components/ui/empty-state";
import { ChefHat, Home, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <EmptyStateWithBackground>
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <ChefHat className="h-16 w-16 text-brand-primary" />
            <div className="absolute -top-2 -right-2 bg-orange-100 rounded-full p-1">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 text-lg">
            Oops! This page seems to have wandered off the menu.
          </p>
          <p className="text-gray-500 text-sm">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Link href="/recipes">
            <Button
              variant="secondary"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Search className="h-4 w-4" />
              <span>Browse Recipes</span>
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Try searching for recipes or check out our popular
            dishes.
          </p>
        </div>
      </div>
    </EmptyStateWithBackground>
  );
}
