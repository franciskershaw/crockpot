"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { cn, isActive } from "@/lib/utils";

const BottomMobileNav = () => {
  const { data: session, status } = useSession();
  const { recipeCount, isLoading: isLoadingCount } = useGetUserRecipeCount();
  const pathname = usePathname();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Helper function to determine if link is active

  // Centralized nav link styling for mobile
  const getMobileNavLinkClasses = (path: string) =>
    cn(
      "relative flex flex-col items-center gap-2 py-3 transition-all duration-200",
      "active:scale-90 active:opacity-70",
      isActive(path, pathname)
        ? "text-brand-primary font-semibold"
        : "text-gray-600"
    );

  // Centralized icon styling for mobile
  const getMobileIconClasses = (path: string) =>
    cn(
      "h-5 w-5 transition-transform duration-200",
      isActive(path, pathname) && "scale-110"
    );

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
        <div className="flex items-center justify-around h-18">
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
                className={getMobileNavLinkClasses("/your-crockpot")}
              >
                <ShoppingBag
                  className={getMobileIconClasses("/your-crockpot")}
                />
                <span className="text-sm font-medium">Your Crockpot</span>
              </Link>
              <Link
                href="/recipes"
                className={getMobileNavLinkClasses("/recipes")}
              >
                <Search className={getMobileIconClasses("/recipes")} />
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
                  className={getMobileNavLinkClasses("/recipes/new")}
                >
                  <Plus className={getMobileIconClasses("/recipes/new")} />
                  <span className="text-sm font-medium">Add Recipe</span>
                </Link>
              )}
            </>
          ) : (
            // Non-logged-in users: Browse Recipes, Login
            <>
              <Link
                href="/recipes"
                className={getMobileNavLinkClasses("/recipes")}
              >
                <Search className={getMobileIconClasses("/recipes")} />
                <span className="text-sm font-medium">Browse Recipes</span>
              </Link>
              <Link href="/" className={getMobileNavLinkClasses("/")}>
                <LogIn className={getMobileIconClasses("/")} />
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
