import { useCurrentRecipe } from '../../hooks/recipes/useCurrentRecipe';

const ViewRecipePage = () => {
  const { recipe } = useCurrentRecipe();
	console.log(recipe)

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
};

export default ViewRecipePage;
