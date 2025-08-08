"use client";
import { ChefHat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRandomRecipes } from "@/actions/recipes";
import Image from "next/image";
import type { Recipe } from "@/data/types";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateWithBackgroundProps {
  children: ReactNode;
  backgroundOpacity?: number;
  backgroundCount?: number;
  className?: string;
}

export default function EmptyStateWithBackground({
  children,
  backgroundOpacity = 10,
  backgroundCount = 12,
  className = "",
}: EmptyStateWithBackgroundProps) {
  // Fetch random recipes for background
  const { data: backgroundRecipes = [] } = useQuery({
    queryKey: ["randomRecipes", backgroundCount],
    queryFn: () => getRandomRecipes(backgroundCount),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map opacity number to Tailwind class
  const getOpacityClass = (opacity: number) => {
    const opacityMap: Record<number, string> = {
      5: "opacity-5",
      10: "opacity-10",
      15: "opacity-15",
      20: "opacity-20",
      25: "opacity-25",
      30: "opacity-30",
      40: "opacity-40",
      50: "opacity-50",
    };
    return opacityMap[opacity] || "opacity-10";
  };

  return (
    <div className={cn("relative col-span-full", className)}>
      {/* Background grid of faded recipe cards */}
      <div
        className={cn(
          "absolute inset-0 grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pointer-events-none",
          getOpacityClass(backgroundOpacity)
        )}
      >
        {backgroundRecipes.map((recipe: Recipe, index) => (
          <div
            key={`${recipe.id}-${index}`}
            className="bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative h-48 bg-gray-200">
              {recipe.image?.url ? (
                <Image
                  src={recipe.image.url}
                  alt={recipe.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ChefHat className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg truncate">{recipe.name}</h3>
              <p className="text-sm text-gray-600">
                {recipe.timeInMinutes} mins
              </p>
            </div>
          </div>
        ))}

        {/* Fill remaining slots if we have fewer recipes */}
        {Array.from({
          length: Math.max(0, backgroundCount - backgroundRecipes.length),
        }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative h-48 bg-gray-200 flex items-center justify-center">
              <ChefHat className="h-16 w-16 text-gray-400" />
            </div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay content */}
      <div className="relative z-10 flex items-center justify-center min-h-[600px]">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8 text-center space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
