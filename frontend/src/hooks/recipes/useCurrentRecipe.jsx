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
  const recipe = allRecipes.find((recipe) => recipe._id === params.id);
  
  let currentRecipeCategories = [];
  let currentRecipeIngredients = [];

  if (recipe) {
    for (let category of recipe.categories) {
      for (let object of recipeCategories) {
        if (object._id === category) {
          currentRecipeCategories.push(object)
        }
      }
    }
    if (currentRecipeCategories.length) {
      recipe.categories = currentRecipeCategories;
    }

    for (let ingredient of recipe.ingredients) {
      for (let object of ingredients) {
        if (object._id === ingredient._id) {
          currentRecipeIngredients.push({
            ...ingredient,
            name: object.name
          })
        }
      }
    }
    if (currentRecipeIngredients.length) {
      recipe.ingredients = currentRecipeIngredients
    }
  }

  return { recipe };
}
