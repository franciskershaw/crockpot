"use client";

import { Button } from "@/components/ui/button";
import { ChefHat, Plus, Search, ShoppingBag, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import LogoutButton from "@/components/landing/LogoutButton";
import { hasPermission, Permission } from "@/lib/action-helpers";
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

export default function Navbar() {
  const { data: session, status } = useSession();
  const { recipeCount, isLoading: isLoadingCount } = useGetUserRecipeCount();
  const pathname = usePathname();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Centralized nav link styling
  const getNavLinkClasses = (path: string) =>
    cn(
      // Base styles
      "relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
      "transition-colors duration-200",
      // Active/click background
      "active:bg-gray-100",
      // Text color
      isActive(path, pathname)
        ? "text-brand-primary font-semibold"
        : "text-gray-700"
    );

  // Centralized text wrapper styling (for the sliding border effect)
  const getTextWrapperClasses = (path: string) =>
    cn(
      // Position for pseudo-element and padding
      "relative pb-1",
      // Bottom border pseudo-element with rounded ends
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-brand-primary after:rounded-full",
      "after:transition-transform after:duration-300 after:origin-right",
      // Active state - border stays visible
      isActive(path, pathname)
        ? "after:scale-x-100"
        : "after:scale-x-0 group-hover:after:scale-x-100"
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
    <nav className="sticky top-0 z-50 shadow-sm bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <ChefHat className="h-8 w-8 text-brand-primary" />
            <span className="text-gradient-brand">Crockpot</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              className={cn(getNavLinkClasses("/recipes"), "group")}
              href="/recipes"
            >
              <Search className="h-4 w-4" />
              <span className={getTextWrapperClasses("/recipes")}>
                Browse Recipes
              </span>
            </Link>

            {isLoading ? (
              // Skeleton loading state - matches authenticated layout to prevent shift
              <>
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-20" />
              </>
            ) : isAuthenticated ? (
              <>
                <Link
                  className={cn(getNavLinkClasses("/your-crockpot"), "group")}
                  href="/your-crockpot"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className={getTextWrapperClasses("/your-crockpot")}>
                    Your Crockpot
                  </span>
                </Link>

                {hasPermission(
                  session.user.role,
                  Permission.CREATE_RECIPES
                ) && (
                  <>
                    {hasReachedLimit ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed">
                            <Plus className="h-4 w-4" />
                            Add Recipe
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            You&apos;ve reached your recipe limit. Upgrade to
                            create more!
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        href="/recipes/new"
                        className={cn(
                          getNavLinkClasses("/recipes/new"),
                          "group"
                        )}
                      >
                        <Plus className="h-4 w-4" />
                        <span className={getTextWrapperClasses("/recipes/new")}>
                          Add Recipe
                        </span>
                      </Link>
                    )}
                  </>
                )}

                {hasPermission(session.user.role, Permission.ADMIN_PANEL) && (
                  <Link
                    href="/admin/users"
                    className={cn(getNavLinkClasses("/admin"), "group")}
                  >
                    <Shield className="h-4 w-4" />
                    <span className={getTextWrapperClasses("/admin")}>
                      Admin
                    </span>
                  </Link>
                )}
                <LogoutButton variant="outline" />
              </>
            ) : (
              <Link href="/">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="md:hidden h-full">
            <MobileMenu session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}
