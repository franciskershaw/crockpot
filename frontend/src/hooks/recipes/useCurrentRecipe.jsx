import { useParams } from 'react-router-dom';
import { useItems } from '../items/useItems';
import { useQuery } from '@tanstack/react-query';
import { fetchSingleRecipe } from '../../queries/recipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

//Hook
export function useCurrentRecipe() {
  const { ingredients } = useItems();
  const params = useParams();

  const { data: recipe } = useQuery([queryKeys.recipes, params.id], () => fetchSingleRecipe(params.id))

  if (recipe) {
    let currentRecipeIngredients = [];
    for (let ingredient of recipe.ingredients) {
      for (let object of ingredients) {
        if (object._id === ingredient._id) {
          currentRecipeIngredients.push({
            ...ingredient,
            name: object.name,
          });
        }
      }
    }
    if (currentRecipeIngredients.length) {
      recipe.ingredients = currentRecipeIngredients;
    }
  }
  
  return { recipe };
}
