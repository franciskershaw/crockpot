"use server";

import Link from "next/link";
import { Plus, Search, ShoppingBag, LogIn } from "lucide-react";
import { auth } from "@/auth";

const BottomMobileNav = async () => {
  const session = await auth();

  return (
    <div className="md:hidden">
      <nav className="fixed bottom-0 left-0 right-0 border-t border-surface-border bg-white">
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
              <Link
                href="/recipes/new"
                className="flex flex-col items-center gap-2 transition-colors text-gray-600"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Add Recipe</span>
              </Link>
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
