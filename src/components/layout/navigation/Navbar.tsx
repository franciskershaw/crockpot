"use server";

import { signOutAction } from "@/actions";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ChefHat, Search } from "lucide-react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
  const session = await auth();

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
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
              href="/browse"
            >
              <Search className="h-4 w-4" />
              Browse Recipes
            </Link>

            {session?.user ? (
              <form action={signOutAction}>
                <Button type="submit" variant="outline">
                  Sign Out
                </Button>
              </form>
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
