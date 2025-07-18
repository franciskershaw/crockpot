"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users } from "lucide-react";
import Image from "next/image";
import type { Recipe } from "@/data/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeCard({
  recipe,
  priority = false,
  skeleton = false,
}: {
  recipe?: Recipe;
  priority?: boolean;
  skeleton?: boolean;
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 backdrop-blur-sm overflow-hidden cursor-pointer pt-0">
      <div className="relative h-48 overflow-hidden">
        {skeleton ? (
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
        ) : recipe?.image?.url ? (
          <div className="absolute inset-0">
            <Image
              src={recipe.image.url}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
          </div>
        ) : (
          <ChefHat className="h-16 w-16 text-brand-secondary" />
        )}
      </div>
      <CardContent>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold group-hover:text-brand-primary transition-colors">
            {skeleton ? (
              <Skeleton className="h-6 w-2/3 bg-gray-200" />
            ) : (
              recipe?.name
            )}
          </h3>
          <div className="flex items-center gap-4 text-sm mb-5">
            {skeleton ? (
              <>
                <Skeleton className="h-4 w-16 bg-gray-200" />
                <Skeleton className="h-4 w-16 bg-gray-200" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {recipe?.timeInMinutes} mins
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Serves {recipe?.serves}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {skeleton ? (
              <>
                <Skeleton className="h-5 w-16 bg-gray-200" />
                <Skeleton className="h-5 w-12 bg-gray-200" />
              </>
            ) : (
              (recipe?.categories ?? []).map((cat) => (
                <Badge
                  key={cat.id}
                  variant="secondary"
                  className="text-xs bg-surface-soft text-text-soft"
                >
                  {cat.name}
                </Badge>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
