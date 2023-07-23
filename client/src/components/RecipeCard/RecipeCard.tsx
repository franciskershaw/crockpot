import React from "react";
import ButtonFav from "../ButtonFav/ButtonFav";
import ButtonCart from "../ButtonCart/ButtonCart";

type RecipeCardProps = {
  imageUrl: string;
  recipeName: string;
  categories: string[];
};

const RecipeCard = ({ imageUrl, recipeName, categories }: RecipeCardProps) => {
  // Get the first three categories from the array
  const firstThreeCategories = categories.slice(0, 3);
  // Get the number of remaining categories
  const remainingCategoriesCount = categories.length - 3;

  return (
    <div className=" rounded-lg overflow-hidden">
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
        <button className="absolute bottom-2 right-2 bg-red-500 rounded-lg text-white">
          Button 3
        </button>
      </div>

      {/* recipeName and categories */}
      <div className="p-2 bg-white rounded-b-lg border border-gray-300">
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
