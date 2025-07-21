import { Card, CardContent } from "@/components/ui/card";
import {
  groupIngredientsByCategory,
  getCategoryIcon,
  type Ingredient,
} from "../helpers/helpers";

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  isMobile?: boolean;
}

export function IngredientsSection({
  ingredients,
  isMobile = false,
}: IngredientsSectionProps) {
  const ingredientsByCategory = groupIngredientsByCategory(ingredients);

  if (isMobile) {
    return (
      <div className="space-y-4">
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
                      <IngredientItem
                        key={index}
                        ingredient={ingredient}
                        size="mobile"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Ingredients ({ingredients.length})
        </h2>

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
                      <IngredientItem
                        key={index}
                        ingredient={ingredient}
                        size="desktop"
                      />
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IngredientItem({
  ingredient,
  size,
}: {
  ingredient: Ingredient;
  size: "mobile" | "desktop";
}) {
  const isMobile = size === "mobile";

  // Format quantity to show decimals only when needed
  const formattedQuantity =
    ingredient.quantity % 1 === 0
      ? ingredient.quantity.toString()
      : ingredient.quantity.toString();

  return (
    <div
      className={`flex items-${isMobile ? "center" : "baseline"} gap-2 ${
        isMobile
          ? "p-2 rounded hover:bg-gray-50"
          : "px-3 py-2 rounded-lg hover:bg-gray-50"
      } transition-colors`}
    >
      <div
        className={`flex items-baseline gap-1 min-w-0 flex-1 ${
          isMobile ? "" : ""
        }`}
      >
        <span
          className={`font-semibold text-gray-900 ${
            isMobile ? "text-sm shrink-0" : "min-w-0 flex-shrink-0"
          }`}
        >
          {formattedQuantity}
        </span>
        {ingredient.unit && (
          <span
            className={`text-gray-600 ${
              isMobile ? "text-xs shrink-0" : "text-sm flex-shrink-0"
            }`}
          >
            {ingredient.unit.abbreviation}
          </span>
        )}
        <span
          className={`text-gray-700 ${
            isMobile ? "text-sm truncate" : "min-w-0"
          }`}
        >
          {ingredient.item?.name}
        </span>
      </div>
    </div>
  );
}
