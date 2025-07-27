"use server";

import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { auth } from "@/auth";

const BottomMobileNav = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div className="md:hidden">
      <nav className="fixed bottom-0 left-0 right-0 border-t border-surface-border bg-white">
        <div className="flex items-center justify-around h-16">
          <Link
            href="/your-crockpot"
            className="flex flex-col items-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-sm font-medium">Your Crockpot</span>
          </Link>
          <button className="flex flex-col items-center gap-2">
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Add Recipe</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BottomMobileNav;
