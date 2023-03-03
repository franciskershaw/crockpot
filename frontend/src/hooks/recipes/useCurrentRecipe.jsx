import { useParams } from 'react-router-dom';
import { useItems } from '../items/useItems';
import { useQuery } from '@tanstack/react-query';
import { useRecipeRequests } from '../queries/useRecipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

//Hook
export function useCurrentRecipe(recipeId) {
  const { fetchSingleRecipe } = useRecipeRequests();
  const { ingredients } = useItems();
  let id;
  const params = useParams();
  if (params.id) {
    id = params.id;
  } else if (!params.id) {
    id = recipeId;
  }

  const { data: recipe } = useQuery([queryKeys.recipes, id], () =>
    fetchSingleRecipe(id)
  );

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
