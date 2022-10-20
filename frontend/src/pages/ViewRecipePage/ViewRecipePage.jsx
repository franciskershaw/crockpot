import { useCurrentRecipe } from '../../hooks/recipes/useCurrentRecipe';
import { redirect } from 'react-router-dom';

const ViewRecipePage = () => {
  const { recipe } = useCurrentRecipe();
  if (recipe) {
    return (
      <div>
        <h2>{recipe.name}</h2>
        <ul>
          {recipe.instructions.map((instruction, index) => (
            <li key={`instruction_${index}`}>{instruction}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <h2>No recipe found</h2>
    )
  }
};

export default ViewRecipePage;
