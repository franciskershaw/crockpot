"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  groupIngredientsByCategory,
  getCategoryIcon,
} from "../helpers/helpers";
import { useRecipeServes } from "@/app/recipes/[id]/hooks/useRecipeServes";
import { ServesControl } from "./ServesControl";
import { Ingredient } from "@/data/types";

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  originalServes: number;
  recipeId: string;
}

export function IngredientsSection({
  ingredients,
  originalServes,
  recipeId,
}: IngredientsSectionProps) {
  const { effectiveServes, scaledIngredients, adjustServes, canAdjustServes } =
    useRecipeServes({
      recipeId,
      originalServes,
      ingredients,
    });

  const ingredientsByCategory = groupIngredientsByCategory(scaledIngredients);

  return (
    <div className="space-y-4 lg:space-y-0">
      {/* Mobile: Serves control separate from ingredient cards */}
      <div className="lg:hidden">
        <ServesControl
          serves={effectiveServes}
          onAdjustServes={adjustServes}
          canAdjust={canAdjustServes}
        />
      </div>

      {/* Mobile: Individual cards for each category */}
      <div className="space-y-4 lg:hidden">
        {Object.entries(ingredientsByCategory).map(
          ([categoryName, ingredients]) => {
            const IconComponent = getCategoryIcon(ingredients);

            return (
              <Card key={categoryName}>
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    {categoryName}
                    <span className="text-xs font-normal text-gray-500">
                      ({ingredients.length})
                    </span>
                  </h3>

                  <div className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <IngredientItem key={index} ingredient={ingredient} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      {/* Desktop: Single card with serves control, title, and sections */}
      <Card className="hidden lg:block">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Ingredients ({scaledIngredients.length})
          </h2>

          <ServesControl
            serves={effectiveServes}
            onAdjustServes={adjustServes}
            canAdjust={canAdjustServes}
          />

          <div className="space-y-6">
            {Object.entries(ingredientsByCategory).map(
              ([categoryName, ingredients]) => {
                const IconComponent = getCategoryIcon(ingredients);

                return (
                  <div key={categoryName} className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                      <IconComponent className="w-5 h-5 text-orange-500" />
                      {categoryName}
                      <span className="text-sm font-normal text-gray-500">
                        ({ingredients.length})
                      </span>
                    </h3>

                    <div className="space-y-2">
                      {ingredients.map((ingredient, index) => (
                        <IngredientItem key={index} ingredient={ingredient} />
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IngredientItem({ ingredient }: { ingredient: Ingredient }) {
  // Format quantity to show decimals only when needed
  const formattedQuantity =
    ingredient.quantity % 1 === 0
      ? ingredient.quantity.toString()
      : ingredient.quantity.toString();

  return (
    <div className="flex items-center lg:items-baseline gap-2 p-2 lg:px-3 lg:py-2 rounded lg:rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-baseline gap-1 min-w-0 flex-1">
        <span className="font-semibold text-gray-900 text-sm lg:text-base shrink-0 lg:min-w-0 lg:flex-shrink-0">
          {formattedQuantity}
        </span>
        {ingredient.unit && (
          <span className="text-gray-600 text-xs lg:text-sm shrink-0 lg:flex-shrink-0">
            {ingredient.unit.abbreviation}
          </span>
        )}
        <span className="text-gray-700 text-sm lg:text-base truncate lg:min-w-0">
          {ingredient.item?.name}
        </span>
      </div>
    </div>
  );
}
