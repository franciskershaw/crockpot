"use server";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Plus,
  Search,
  ShoppingBag,
  Shield,
  Users,
  Package,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import LogoutButton from "@/components/auth/LogoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              href="/recipes"
            >
              <Search className="h-4 w-4" />
              Browse Recipes
            </Link>

            {session?.user && (
              <>
                <Link
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
                  href="/your-crockpot"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Your Crockpot
                </Link>

                {session?.user?.role === "ADMIN" && (
                  <>
                    <Link
                      href="/recipes/new"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                      Add Recipe
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 px-3 py-2 h-auto text-sm font-medium transition-colors hover:bg-gray-100"
                        >
                          <Shield className="h-4 w-4" />
                          Admin
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            Users
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/recipes"
                            className="flex items-center gap-2"
                          >
                            <ChefHat className="h-4 w-4" />
                            Recipes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/items"
                            className="flex items-center gap-2"
                          >
                            <Package className="h-4 w-4" />
                            Items
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin/units"
                            className="flex items-center gap-2"
                          >
                            <Ruler className="h-4 w-4" />
                            Units
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}
            {!session?.user ? (
              <Link href="/">
                <Button variant="outline">Login</Button>
              </Link>
            ) : (
              <LogoutButton variant="outline" />
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
