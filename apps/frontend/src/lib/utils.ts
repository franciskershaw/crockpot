import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Permission, PERMISSION_REQUIREMENTS, UserRole } from "@/shared/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isActive = (path: string, pathname: string) => {
  if (path === "/recipes") {
    // Only match /recipes, /recipes/[id], NOT /recipes/new or /recipes/edit
    return (
      pathname === "/recipes" ||
      (pathname.startsWith("/recipes/") &&
        !pathname.startsWith("/recipes/new") &&
        !pathname.startsWith("/recipes/edit"))
    );
  }
  if (path === "/recipes/new") return pathname.startsWith("/recipes/new");
  if (path === "/your-crockpot") return pathname === "/your-crockpot";
  if (path === "/admin") return pathname.startsWith("/admin");
  return pathname === path;
};

// /**
//  * Helper function to check if a role has permission for a specific action
//  */
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const allowedRoles = PERMISSION_REQUIREMENTS[permission];
  return allowedRoles.includes(userRole);
}
