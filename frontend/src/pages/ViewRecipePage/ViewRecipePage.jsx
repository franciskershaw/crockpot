import { useCurrentRecipe } from '../../hooks/recipes/useCurrentRecipe';

const ViewRecipePage = () => {
  const { currentRecipe: recipe, currentRecipeCategories: categories, currentRecipeIngredients: ingredients } = useCurrentRecipe();
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
        <ul>
          {categories.map((category, index) => (
            <li key={`category_${index}`}>{category.name}</li>
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
