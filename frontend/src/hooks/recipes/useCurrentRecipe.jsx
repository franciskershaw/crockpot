import { useRecipes } from '../../hooks/recipes/useRecipes';
import { useParams } from 'react-router-dom';

//Hook
export function useCurrentRecipe() {
  const { allRecipes } = useRecipes();
  const params = useParams();
  const recipe = allRecipes.find((recipe) => recipe._id === params.id);

  return { recipe };
}
