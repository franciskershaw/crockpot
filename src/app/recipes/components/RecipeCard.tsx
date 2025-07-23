"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Star } from "lucide-react";
import Image from "next/image";
import type { Recipe } from "@/data/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import RecipeActions from "./RecipeActions";

export default function RecipeCard({
  recipe,
  priority = false,
  skeleton = false,
}: {
  recipe?: Recipe;
  priority?: boolean;
  skeleton?: boolean;
}) {
  const { data: session, status } = useSession();

  // Only show relevance badges when meaningful content filters are applied (not just time)
  const shouldShowBadges = recipe?.relevance?.hasContentFilters === true;

  // Calculate badge type based on score relative to highest score
  let badgeType: "best" | "great" | "none" = "none";

  if (shouldShowBadges && recipe?.relevance) {
    const {
      score,
      highestScoreInResults,
      maxPossibleScore,
      matchedIngredients,
      matchedCategories,
    } = recipe.relevance;

    // Best Match: Either the highest score in results, or 80%+ of max possible
    if (
      score === highestScoreInResults ||
      (maxPossibleScore > 0 && score / maxPossibleScore >= 0.8)
    ) {
      badgeType = "best";
    }
    // Great Match: 50%+ of max possible score OR 3+ total matches
    else if (
      (maxPossibleScore > 0 && score / maxPossibleScore >= 0.5) ||
      matchedIngredients + matchedCategories >= 3
    ) {
      badgeType = "great";
    }
  }

  // Save scroll position before navigating to recipe
  const handleRecipeClick = () => {
    if (typeof window !== "undefined") {
      try {
        const scrollPosition = window.scrollY;
        sessionStorage.setItem(
          "crockpot_browse_scroll_position",
          scrollPosition.toString()
        );
      } catch {
        // Ignore storage errors
      }
    }
  };

  const cardContent = (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 backdrop-blur-sm overflow-hidden cursor-pointer pt-0 relative w-full">
      {/* Relevance badge for best matches */}
      {badgeType === "best" && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-600" />
            Best Match
          </Badge>
        </div>
      )}

      {/* Relevance badge for great matches */}
      {badgeType === "great" && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <Star className="h-3 w-3 fill-green-600" />
            Good Match
          </Badge>
        </div>
      )}

      <div className="relative h-48 overflow-hidden border">
        {skeleton ? (
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
        ) : recipe?.image?.url ? (
          <div className="absolute inset-0 border">
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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <ChefHat className="h-16 w-16 text-brand-secondary" />
          </div>
        )}
      </div>

      {/* Rest of the card content */}
      <CardContent className="px-4 pb-4 pt-0 ">
        <div className="space-y-3">
          {/* Action buttons for logged-in users */}
          {!skeleton && status === 'authenticated' && session?.user && recipe && (
            <RecipeActions recipe={recipe} />
          )}
          
          <h3
            className="text-xl font-semibold group-hover:text-brand-primary transition-colors line-clamp-1 text-ellipsis"
            title={recipe?.name}
          >
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
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {recipe?.timeInMinutes} mins
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    Serves {recipe?.serves}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Relevance indicators */}
          {shouldShowBadges && recipe?.relevance && (
            <div className="flex flex-wrap gap-1 mb-3">
              {recipe.relevance.matchedIngredients > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  {recipe.relevance.matchedIngredients} ingredient
                  {recipe.relevance.matchedIngredients > 1 ? "s" : ""} matched
                </Badge>
              )}
              {recipe.relevance.matchedCategories > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {recipe.relevance.matchedCategories} category
                  {recipe.relevance.matchedCategories > 1
                    ? " matches"
                    : " match"}
                </Badge>
              )}
            </div>
          )}

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

  // If skeleton or no recipe ID, don't wrap in Link
  if (skeleton || !recipe?.id) {
    return cardContent;
  }

  // Wrap in Link with proper constraints and scroll position saving
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="block w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-lg"
      onClick={handleRecipeClick}
    >
      {cardContent}
    </Link>
  );
}
