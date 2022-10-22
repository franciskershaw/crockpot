import { useCurrentRecipe } from '../../hooks/recipes/useCurrentRecipe';
import { useEffect } from 'react';

const ViewRecipePage = () => {
  const { recipe } = useCurrentRecipe();
  useEffect(() => {
    console.log(recipe)
  },[recipe])
  
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
          {recipe.categories.map((category, index) => (
            <li className='font-bold' key={`category_${index}`}>{category.name}</li>
          ))}
        </ul>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={`ingredient_${index}`}>{ingredient.name} x {ingredient.quantity} {ingredient.unit}</li>
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