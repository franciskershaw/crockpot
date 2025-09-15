"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Shield } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import LogoutButton from "@/components/landing/LogoutButton";

interface MobileMenuProps {
  session: Session | null;
}

export default function MobileMenu({ session }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const menu = menuRef.current;
    if (!menu) return;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    menu.addEventListener("keydown", handleKeyDown);
    return () => menu.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Restore focus to hamburger when menu closes
  useEffect(() => {
    if (!isOpen && hamburgerRef.current) {
      hamburgerRef.current.focus();
    }
  }, [isOpen]);

  const toggleMenu = useCallback(() => {
    setIsOpen((open) => !open);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="h-full flex items-center">
      {/* Hamburger Button - Always visible */}
      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className={`z-50 relative w-6 h-5 transform transition-all duration-500 ease-in-out cursor-pointer focus:outline-none ${
          isOpen ? "rotate-0" : ""
        }`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-sidebar"
      >
        <span className="sr-only">Menu</span>
        <span
          className={`absolute block h-0.5 w-full bg-gray-800 rounded-sm transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
          style={{ top: "0px" }}
        />
        <span
          className={`absolute block h-0.5 w-full bg-gray-800 rounded-sm transition-all duration-300 ease-in-out ${
            isOpen ? "rotate-45" : ""
          }`}
          style={{ top: "8px" }}
        />
        <span
          className={`absolute block h-0.5 w-full bg-gray-800 rounded-sm transition-all duration-300 ease-in-out ${
            isOpen ? "-rotate-45" : ""
          }`}
          style={{ top: "8px" }}
        />
        <span
          className={`absolute block h-0.5 w-full bg-gray-800 rounded-sm transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
          style={{ top: "16px" }}
        />
      </button>

      {/* Sidebar (full screen) */}
      <div
        id="mobile-menu-sidebar"
        ref={menuRef}
        tabIndex={isOpen ? 0 : -1}
        className={`fixed inset-0 h-full w-full bg-white z-40 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-modal="true"
        role="dialog"
        style={{ outline: "none" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 p-6 space-y-4">
            <Link
              href="/recipes"
              onClick={toggleMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span className="font-medium">Browse Recipes</span>
            </Link>

            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={toggleMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Shield className="h-5 w-5 mr-3" />
                Admin
              </Link>
            )}

            <span>Future: profile settings, link to another user</span>

            {session?.user ? (
              <LogoutButton
                className="w-full mt-6"
                onLogout={handleCloseMenu}
              />
            ) : (
              <Link href="/" onClick={toggleMenu} className="block mt-6">
                <Button className="w-full" variant="outline">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
