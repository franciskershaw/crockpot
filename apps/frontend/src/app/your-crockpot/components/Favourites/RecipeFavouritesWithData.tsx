import RecipeFavourites from "./RecipeFavourites";

/**
 * Server component wrapper for RecipeFavourites
 * Provides consistent pattern with RecipeMenuWithData
 * Could be extended to fetch static reference data if needed
 */
export default function RecipeFavouritesWithData() {
  return <RecipeFavourites />;
}
