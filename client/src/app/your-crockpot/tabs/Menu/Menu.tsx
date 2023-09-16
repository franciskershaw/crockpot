import Button from "@/src/components/Button/Button";
import useRecipeMenu from "../../hooks/useRecipeMenu";
import RecipeCardList from "@/src/components/RecipeCardList/RecipeCardList";

const Menu = () => {
  const { recipeMenuRecipes } = useRecipeMenu();
  const bp = "xl";

  return (
    <div className={`${bp}:flex ${bp}:mt-8 gap-4 justify-between`}>
      <div className={`flex justify-center my-3 ${bp}:hidden`}>
        <Button
          border
          text="Shopping List"
          onClick={() => console.log("Hello!")}
        />
      </div>
      <div className={`tw hidden ${bp}:block`}>Shopping list component</div>

      <RecipeCardList recipes={recipeMenuRecipes} />
    </div>
  );
};

export default Menu;
