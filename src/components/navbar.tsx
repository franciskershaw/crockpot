"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  ChefHat,
  Search,
  Heart,
  Plus,
  Settings,
  LogOut,
  User,
} from "lucide-react";

// Mock user state - in real app this would come from auth context
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  initials: "JD",
  isAdmin: true,
};

const navigationLinks = [
  {
    href: "/browse",
    label: "Browse Recipes",
    icon: <Search className="h-4 w-4" />,
  },
  {
    href: "/your-crockpot",
    label: "Your Crockpot",
    icon: <Heart className="h-4 w-4" />,
  },
];

const mobileBottomNavLinks = [
  {
    href: "/browse",
    label: "Browse",
    icon: <Search className="h-5 w-5" />,
  },
  {
    href: "/your-crockpot",
    label: "Your Crockpot",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    href: "#",
    label: "Add Recipe",
    icon: <Plus className="h-5 w-5" />,
    action: "add-recipe",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Simulate logout and redirect to home
    router.push("/");
  };

  const handleAddRecipe = () => {
    // For now, just show an alert - later this would open a modal or navigate to add recipe page
    alert("Add Recipe functionality coming soon!");
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const handleBottomNavAction = (link: { href: string; action?: string }) => {
    if (link.action === "add-recipe") {
      handleAddRecipe();
    } else {
      router.push(link.href);
    }
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <ChefHat className="h-8 w-8 text-brand-primary" />
              <span className="text-gradient-brand">Crockpot</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath(link.href)
                      ? "bg-surface-soft text-brand-primary"
                      : "text-gray-600 hover:text-brand-primary hover:bg-surface-warm"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddRecipe}
                className="flex items-center gap-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
              >
                <Plus className="h-4 w-4" />
                Add Recipe
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-brand-secondary text-brand-primary">
                        {mockUser.initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{mockUser.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mockUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {mockUser.isAdmin && (
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button - Only for user actions now */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <ChefHat className="h-6 w-6 text-brand-primary" />
                      <span className="text-gradient-brand">Crockpot</span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-4 mt-8">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-4 bg-surface-warm rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-brand-secondary text-brand-primary">
                          {mockUser.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{mockUser.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {mockUser.email}
                        </p>
                      </div>
                    </div>

                    {/* Mobile User Actions */}
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          router.push("/profile");
                          setIsOpen(false);
                        }}
                        className="w-full justify-start gap-3 text-gray-600 hover:text-brand-primary"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Button>

                      {mockUser.isAdmin && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            router.push("/admin");
                            setIsOpen(false);
                          }}
                          className="w-full justify-start gap-3 text-gray-600 hover:text-brand-primary"
                        >
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-3 h-16">
          {mobileBottomNavLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleBottomNavAction(link)}
              className={`flex flex-col items-center justify-center gap-1 p-2 transition-colors ${
                isActivePath(link.href)
                  ? "text-brand-primary bg-surface-warm"
                  : "text-gray-600 hover:text-brand-primary hover:bg-surface-warm"
              }`}
            >
              {link.icon}
              <span className="text-xs font-medium">{link.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
