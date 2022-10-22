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
  
  let currentRecipeCategories = []
  let currentRecipeIngredients = []
  
  if (currentRecipe) {
    console.log(currentRecipe)
    currentRecipe.categories.map((category) => {
      for (let object of recipeCategories) {
        if (object._id === category) {
          currentRecipeCategories.push(object)
        }
      }
    })
  }

  return { currentRecipe, currentRecipeCategories, currentRecipeIngredients };
}
