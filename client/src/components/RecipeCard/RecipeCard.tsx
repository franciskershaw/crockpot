import React from "react";
import ButtonFav from "../ButtonFav/ButtonFav";
import ButtonCart from "../ButtonCart/ButtonCart";
import TimingTag from "../TimingTag/TimingTag";

type RecipeCardProps = {
  imageUrl: string;
  cookingTime: number;
  recipeName: string;
  categories: string[];
};

const RecipeCard = ({
  imageUrl,
  cookingTime,
  recipeName,
  categories,
}: RecipeCardProps) => {
  // Get the first three categories from the array
  const firstThreeCategories = categories.slice(0, 3);
  // Get the number of remaining categories
  const remainingCategoriesCount = categories.length - 3;

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="relative">
        {/* Background image */}
        <div
          className="bg-cover bg-center h-64"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* Absolute buttons */}
        <div className="absolute top-2 left-2">
          <ButtonFav recipeId={recipeName} />
        </div>
        <div className="absolute top-2 right-2">
          <ButtonCart recipeId={recipeName} />
        </div>
        <div className="absolute bottom-[-12px] right-2">
          <TimingTag time={cookingTime} />
        </div>
      </div>

      {/* recipeName and categories */}
      <div className="px-2 py-3 bg-white rounded-b-lg border border-gray-300">
        <h3 className="truncate">{recipeName}</h3>
        <p className="truncate">
          {firstThreeCategories.join(" | ")}
          {remainingCategoriesCount > 0 &&
            ` | +${remainingCategoriesCount} more`}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
