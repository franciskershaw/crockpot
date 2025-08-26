"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Star } from "lucide-react";
import Image from "next/image";
import type { Recipe } from "@/data/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import RecipeCardActions from "./RecipeCardActions";

export default function RecipeCard({
  recipe,
  priority = false,
  skeleton = false,
  fromPage,
}: {
  recipe?: Recipe;
  priority?: boolean;
  skeleton?: boolean;
  fromPage?: string;
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

  // Helper function to render action buttons
  const renderActionButtons = () => {
    if (skeleton || status !== "authenticated" || !session?.user || !recipe) {
      return null;
    }

    return (
      <div className="absolute left-2 top-2 z-10 pointer-events-auto w-[calc(100%-1rem)]">
        <RecipeCardActions recipe={recipe} />
      </div>
    );
  };

  // Helper function to render relevance badges
  const renderRelevanceBadges = () => {
    if (badgeType === "none") return null;

    return (
      <div className="absolute bottom-2 right-2 z-10">
        <Badge
          className={`flex items-center gap-1 ${
            badgeType === "best"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : "bg-green-100 text-green-800 border-green-200"
          }`}
        >
          <Star
            className={`h-3 w-3 ${
              badgeType === "best" ? "fill-yellow-600" : "fill-green-600"
            }`}
          />
          {badgeType === "best" ? "Best Match" : "Good Match"}
        </Badge>
      </div>
    );
  };

  const cardContent = (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 backdrop-blur-sm overflow-hidden cursor-pointer pt-0 relative w-full">
      <div className="relative h-48 overflow-hidden border">
        {skeleton ? (
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
        ) : recipe?.image?.url ? (
          <div className="absolute inset-0 border">
            <Image
              src={recipe.image.url ?? ""}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
            {renderActionButtons()}
            {renderRelevanceBadges()}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <ChefHat className="h-16 w-16 text-brand-secondary" />
            {renderActionButtons()}
            {renderRelevanceBadges()}
          </div>
        )}
      </div>

      {/* Rest of the card content */}
      <CardContent className="px-4 pb-4 pt-0 ">
        <div className="space-y-3">
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
      href={`/recipes/${recipe.id}?from=${encodeURIComponent(
        fromPage || window.location.pathname
      )}`}
      className="block w-full min-w-0 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-lg"
      onClick={handleRecipeClick}
    >
      {cardContent}
    </Link>
  );
}
