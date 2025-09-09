"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, ChefHat, Package, Ruler, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Recipes", href: "/admin/recipes", icon: ChefHat },
  { name: "Recipe Categories", href: "/admin/recipe-categories", icon: Tags },
  { name: "Items", href: "/admin/items", icon: Package },
  { name: "Units", href: "/admin/units", icon: Ruler },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  // Determine current page from pathname
  let currentPage:
    | "users"
    | "recipes"
    | "items"
    | "units"
    | "recipe-categories" = "users";
  let pageTitle = "Users Management";

  if (pathname.includes("/admin/users")) {
    currentPage = "users";
    pageTitle = "Users Management";
  } else if (pathname.includes("/admin/recipes")) {
    currentPage = "recipes";
    pageTitle = "Recipe Oversight";
  } else if (pathname.includes("/admin/recipe-categories")) {
    currentPage = "recipe-categories";
    pageTitle = "Recipe Category Management";
  } else if (pathname.includes("/admin/items")) {
    currentPage = "items";
    pageTitle = "Item Management";
  } else if (pathname.includes("/admin/units")) {
    currentPage = "units";
    pageTitle = "Unit Management";
  }

  return (
    <div className="mb-6">
      {/* Page Title */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          {pageTitle}
        </h1>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === `/admin/${currentPage}`;

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
