"use client";
import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateWithBackgroundProps {
  children: ReactNode;
  backgroundOpacity?: number;
  className?: string;
}

export default function EmptyStateWithBackground({
  children,
  backgroundOpacity = 10,
  className = "",
}: EmptyStateWithBackgroundProps) {
  // Static recipe images
  const staticRecipes = [
    {
      id: 1,
      name: "Bean and Haloumi Tacos",
      image: "/recipe1.webp",
      timeInMinutes: 30,
    },
    {
      id: 2,
      name: "Veggie Fajitas",
      image: "/recipe2.webp",
      timeInMinutes: 30,
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      image: "/recipe3.webp",
      timeInMinutes: 30,
    },
    {
      id: 4,
      name: "Chicken Tikka Masala",
      image: "/Recipe4.webp",
      timeInMinutes: 30,
    },
    {
      id: 5,
      name: "Beef and Broccoli",
      image: "/recipe5.webp",
      timeInMinutes: 30,
    },
    {
      id: 6,
      name: "Beef and Broccoli",
      image: "/recipe6.webp",
      timeInMinutes: 30,
    },
  ];

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
          "absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 pointer-events-none",
          getOpacityClass(backgroundOpacity)
        )}
      >
        {staticRecipes.map((recipe) => (
          <div
            key={`static-recipe-${recipe.id}`}
            className="bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative h-32 sm:h-48 bg-gray-200">
              <Image
                src={recipe.image}
                alt={recipe.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-sm sm:text-lg truncate">
                {recipe.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {recipe.timeInMinutes} mins
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay content */}
      <div className="relative flex items-center justify-center min-h-[400px] md:min-h-[600px] pb-16 md:pb-0">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6 md:p-8 text-center space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
