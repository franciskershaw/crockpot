import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
