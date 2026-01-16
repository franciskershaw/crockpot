"use client";
import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateWithBackgroundProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
}

export default function EmptyStateWithBackground({
  children,
  className = "",
  minHeight,
}: EmptyStateWithBackgroundProps) {
  // Static recipe images
  const staticRecipes = [
    {
      id: 1,
      image: "/images/recipe1.webp",
    },
    {
      id: 2,
      image: "/images/recipe2.webp",
    },
    {
      id: 3,
      image: "/images/recipe3.webp",
    },
    {
      id: 4,
      image: "/images/recipe4.webp",
    },
    {
      id: 5,
      image: "/images/recipe5.webp",
    },
    {
      id: 6,
      image: "/images/recipe6.webp",
    },
  ];

  return (
    <div className={cn("relative col-span-full", className)}>
      {/* Background collage of images */}
      <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 pointer-events-none opacity-10">
        {staticRecipes.map((recipe) => (
          <div
            key={`static-recipe-${recipe.id}`}
            className="relative w-full h-full"
          >
            <Image
              src={recipe.image}
              alt="Recipe"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
          </div>
        ))}
      </div>

      {/* Overlay content */}
      <div
        className={cn(
          "relative flex items-center justify-center pb-16 md:pb-0",
          minHeight || "min-h-[calc(100vh-20rem)] md:min-h-[calc(100vh-16rem)]"
        )}
      >
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6 md:p-8 text-center space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
