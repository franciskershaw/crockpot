import Button from "@/src/components/Button/Button";
import useRecipeMenu from "../../hooks/useRecipeMenu";
import RecipeCardList from "@/src/components/RecipeCardList/RecipeCardList";
import ShoppingList from "../../components/ShoppingList/ShoppingList";

const Menu = () => {
  const { recipeMenuRecipes } = useRecipeMenu();

  return (
    <div className={`xl:flex xl:mt-8 gap-4 mx-8`}>
      <div className={`flex justify-center my-3 xl:hidden`}>
        <Button
          border
          text="Shopping List"
          onClick={() => console.log("Hello!")}
        />
      </div>
      <div className={`tw hidden xl:block w-1/3`}>
        <ShoppingList />
      </div>
      <div className="w-2/3">
        <RecipeCardList recipes={recipeMenuRecipes} />
      </div>
    </div>
  );
};

export default Menu;
