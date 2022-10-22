import { useCurrentRecipe } from '../../hooks/recipes/useCurrentRecipe';
import { useEffect } from 'react';
import Header from '../../layout/header/Header';
import Toggle from '../../components/toggles/Toggle'

const ViewRecipePage = () => {
  const { recipe } = useCurrentRecipe();
  useEffect(() => {
    console.log(recipe)
  },[recipe])
  
  if (recipe) {
    return (
      <>
        <Header title={recipe.name}>
        </Header>
        {/* ^ rework header to include more elements - user name, cooking time */}

        {/* Image */}

        <div className='container'>
          {/* Categories */}
          <ul>
            {recipe.categories.map((category, index) => (
              <li className='font-bold' key={`category_${index}`}>{category.name}</li>
            ))}
          </ul>

          {/* Quantity toggle */}

          <Toggle left={"Ingredients"} right={"Instructions"} box>
            {/* Ingredients */}
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`ingredient_${index}`}>{ingredient.name} x {ingredient.quantity} {ingredient.unit}</li>
              ))}
            </ul>
            {/* Instructions */}
            <ol>
              {recipe.instructions.map((instruction, index) => (
                <li key={`instruction_${index}`}>{instruction}</li>
              ))}
            </ol>
          </Toggle>

          {/* Notes */}
        </div>
      </>
    );
  } else {
    return (
      <h2>No recipe found</h2>
    )
  }
};

export default ViewRecipePage;