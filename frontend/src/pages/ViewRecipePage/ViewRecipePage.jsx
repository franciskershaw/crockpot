import { useCurrentRecipe } from '../../hooks/recipes/useCurrentRecipe';

const ViewRecipePage = () => {
  const { currentRecipe: recipe, currentRecipeCategories: categories, currentRecipeingredients: ingredients } = useCurrentRecipe();
  console.log(recipe)
  console.log(categories)
  console.log(ingredients)
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
