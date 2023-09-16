import Button from "@/src/components/Button/Button";
import useRecipeMenu from "../../hooks/useRecipeMenu";
import RecipeCardList from "@/src/components/RecipeCardList/RecipeCardList";

const Menu = () => {
  const { recipeMenuRecipes } = useRecipeMenu();
  const breakpoint = "xl";

  return (
    <div>
      <div className={`flex justify-center my-3 ${breakpoint}:hidden`}>
        <Button
          type="tertiary"
          border
          text="Shopping List"
          onClick={() => console.log("Hello!")}
        />
      </div>
      <div>
        <RecipeCardList recipes={recipeMenuRecipes} />
      </div>
    </div>
  );
};

export default Menu;
