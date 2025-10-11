"use client";

import Link from "next/link";
import { Plus, Search, ShoppingBag, LogIn } from "lucide-react";
import { UserRole } from "@/data/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { useGetUserRecipeCount } from "@/hooks/useUserRecipes";
import { Skeleton } from "@/components/ui/skeleton";

const BottomMobileNav = () => {
  const { data: session, status } = useSession();
  const { recipeCount, isLoading: isLoadingCount } = useGetUserRecipeCount();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Check if user has reached recipe limit
  const hasReachedLimit =
    isAuthenticated && !isLoadingCount
      ? (() => {
          const userRole = session.user.role as UserRole;
          return (
            (userRole === UserRole.FREE && recipeCount >= 5) ||
            (userRole === UserRole.PREMIUM && recipeCount >= 10)
          );
        })()
      : false;

  return (
    <div className="md:hidden">
      <nav className="fixed bottom-0 left-0 right-0 border-t border-surface-border bg-white z-50">
        <div className="flex items-center justify-around h-16">
          {isLoading ? (
            // Skeleton loading state - show 3 items to match most common (authenticated) state
            <>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-3 w-14" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-3 w-20" />
              </div>
            </>
          ) : isAuthenticated ? (
            // Logged-in users: Your Crockpot, Browse, Add Recipe
            <>
              <Link
                href="/your-crockpot"
                className="flex flex-col items-center gap-2 transition-colors text-gray-600"
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm font-medium">Your Crockpot</span>
              </Link>
              <Link
                href="/recipes"
                className="flex flex-col items-center gap-2 transition-colors text-gray-600"
              >
                <Search className="h-5 w-5" />
                <span className="text-sm font-medium">Browse</span>
              </Link>
              {hasReachedLimit ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex flex-col items-center gap-2 text-gray-400 cursor-not-allowed">
                      <Plus className="h-5 w-5" />
                      <span className="text-sm font-medium">Add Recipe</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      You&apos;ve reached your recipe limit. Upgrade to create
                      more!
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href="/recipes/new"
                  className="flex flex-col items-center gap-2 transition-colors text-gray-600"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-sm font-medium">Add Recipe</span>
                </Link>
              )}
            </>
          ) : (
            // Non-logged-in users: Browse Recipes, Login
            <>
              <Link
                href="/recipes"
                className="flex flex-col items-center gap-2 transition-colors text-gray-600"
              >
                <Search className="h-5 w-5" />
                <span className="text-sm font-medium">Browse Recipes</span>
              </Link>
              <Link
                href="/"
                className="flex flex-col items-center gap-2 transition-colors text-gray-600"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default BottomMobileNav;
