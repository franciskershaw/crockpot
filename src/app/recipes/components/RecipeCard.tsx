"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Star } from "lucide-react";
import Image from "next/image";
import type { Recipe } from "@/data/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useCallback, useMemo, memo } from "react";
import RecipeCardActions from "./RecipeCardActions";

// Move skeleton outside component - defined once
const SkeletonWithShimmer = memo(({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
  </div>
));
SkeletonWithShimmer.displayName = "SkeletonWithShimmer";

// Badge calculation helper - pure function outside component
const calculateBadgeType = (
  recipe: Recipe | undefined
): "best" | "great" | "none" => {
  const shouldShowBadges = recipe?.relevance?.hasContentFilters === true;
  if (!shouldShowBadges || !recipe?.relevance) return "none";

  const {
    score,
    highestScoreInResults,
    maxPossibleScore,
    matchedIngredients,
    matchedCategories,
  } = recipe.relevance;

  if (
    score === highestScoreInResults ||
    (maxPossibleScore > 0 && score / maxPossibleScore >= 0.8)
  ) {
    return "best";
  }

  if (
    (maxPossibleScore > 0 && score / maxPossibleScore >= 0.5) ||
    matchedIngredients + matchedCategories >= 3
  ) {
    return "great";
  }

  return "none";
};

// Memoized sub-components
const RelevanceBadge = memo(
  ({ badgeType }: { badgeType: "best" | "great" | "none" }) => {
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
  }
);
RelevanceBadge.displayName = "RelevanceBadge";

const RecipeCard = memo(function RecipeCard({
  recipe,
  priority = false,
  skeleton = false,
  fromPage = "/recipes",
}: {
  recipe?: Recipe;
  priority?: boolean;
  skeleton?: boolean;
  fromPage?: string;
}) {
  // Only call useSession once at top level - session is stable
  const { data: session, status } = useSession();
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize badge calculation
  const badgeType = useMemo(() => calculateBadgeType(recipe), [recipe]);

  // Memoize callbacks
  const handleRecipeClick = useCallback(() => {
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
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Determine if we should show action buttons
  const showActions =
    !skeleton && status === "authenticated" && !!session?.user && !!recipe;

  // Memoize the href to avoid recalculation
  const href = useMemo(
    () => `/recipes/${recipe?.id}?from=${encodeURIComponent(fromPage)}`,
    [recipe?.id, fromPage]
  );

  const cardContent = (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-0 overflow-hidden cursor-pointer pt-0 relative w-full">
      <div className="relative h-48 overflow-hidden border">
        {skeleton ? (
          <SkeletonWithShimmer className="absolute inset-0 w-full h-full" />
        ) : recipe?.image?.url ? (
          <div
            className={`absolute inset-0 border bg-accent ${
              !imageLoaded ? "animate-pulse" : ""
            }`}
          >
            <Image
              src={recipe.image.url}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
              onLoad={handleImageLoad}
              loading={priority ? "eager" : "lazy"}
            />
            {showActions && (
              <div className="absolute left-2 top-2 z-10 pointer-events-auto w-[calc(100%-1rem)]">
                <RecipeCardActions recipe={recipe} />
              </div>
            )}
            <RelevanceBadge badgeType={badgeType} />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <ChefHat className="h-16 w-16 text-brand-secondary" />
            {showActions && (
              <div className="absolute left-2 top-2 z-10 pointer-events-auto w-[calc(100%-1rem)]">
                <RecipeCardActions recipe={recipe} />
              </div>
            )}
            <RelevanceBadge badgeType={badgeType} />
          </div>
        )}
      </div>

      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          <h3
            className="text-xl font-semibold group-hover:text-brand-primary transition-colors line-clamp-1 text-ellipsis"
            title={recipe?.name}
          >
            {skeleton ? (
              <SkeletonWithShimmer className="h-6 w-2/3" />
            ) : (
              recipe?.name
            )}
          </h3>
          <div className="flex items-center gap-4 text-sm mb-5">
            {skeleton ? (
              <>
                <SkeletonWithShimmer className="h-4 w-16" />
                <SkeletonWithShimmer className="h-4 w-16" />
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
          {badgeType !== "none" && recipe?.relevance && (
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
                <SkeletonWithShimmer className="h-5 w-16" />
                <SkeletonWithShimmer className="h-5 w-12" />
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

  if (skeleton || !recipe?.id) {
    return cardContent;
  }

  return (
    <Link
      href={href}
      className="block w-full min-w-0 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:ring-offset-2 rounded-lg"
      onClick={handleRecipeClick}
    >
      {cardContent}
    </Link>
  );
});

RecipeCard.displayName = "RecipeCard";

export default RecipeCard;
