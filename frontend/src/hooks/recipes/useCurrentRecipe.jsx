import { useRecipes } from '../../hooks/recipes/useRecipes';
import { useParams } from 'react-router-dom';
import { useRecipeCategories } from './useRecipeCategories';
import { useItems } from '../items/useItems';

//Hook
export function useCurrentRecipe() {
  const { allRecipes } = useRecipes();
  const { recipeCategories } = useRecipeCategories();
  const { ingredients } = useItems();

  const params = useParams();
  const currentRecipe = allRecipes.find((recipe) => recipe._id === params.id);
  
  let currentRecipeCategories = [];
  let currentRecipeIngredients = [];

  if (currentRecipe) {
    for (let category of currentRecipe.categories) {
      for (let object of recipeCategories) {
        if (object._id === category) {
          currentRecipeCategories.push(object)
        }
      }
    }
    if (currentRecipeCategories.length) {
      currentRecipe.categories = currentRecipeCategories;
    }
  }

  return { currentRecipe };
}
