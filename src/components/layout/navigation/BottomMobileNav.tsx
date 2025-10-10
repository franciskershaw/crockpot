"use server";

import Link from "next/link";
import { Plus, Search, ShoppingBag, LogIn } from "lucide-react";
import { auth } from "@/auth";
import { getUserRecipeCount } from "@/data/recipes/getUserRecipeCount";
import { UserRole } from "@/data/types";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const BottomMobileNav = async () => {
  const session = await auth();

  // Check if user has reached recipe limit
  let hasReachedLimit = false;
  if (session?.user?.id) {
    const userRecipeCount = await getUserRecipeCount(session.user.id);
    const userRole = session.user.role as UserRole;
    hasReachedLimit =
      (userRole === UserRole.FREE && userRecipeCount >= 5) ||
      (userRole === UserRole.PREMIUM && userRecipeCount >= 10);
  }

  return (
    <div className="md:hidden">
      <nav className="fixed bottom-0 left-0 right-0 border-t border-surface-border bg-white z-50">
        <div className="flex items-center justify-around h-16">
          {session ? (
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
