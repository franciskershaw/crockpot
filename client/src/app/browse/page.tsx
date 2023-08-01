"use client";

import SearchBar from "@/src/components/FormSearchBar/SearchBar";
import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import Button from "@/src/components/Button/Button";
import { AiFillFilter } from "react-icons/ai";
import { GrRefresh } from "react-icons/gr";
import Switch from "@/src/components/Switch/Switch";
import Slider from "@/src/components/Slider/Slider";
import Accordion from "@/src/components/Accordion/Accordion";
import Checkbox from "@/src/components/Checkbox/Checkbox";
import recipesData from "../../data/recipes.json";
import { getCategories, getIngredients } from "@/src/hooks/recipeFunctions";

interface Recipe {
  imageUrl: string;
  cookingTime: number;
  recipeName: string;
  ingredients: string[];
  categories: string[]; // Assuming categories are strings in the JSON data
}

const BrowsePage = () => {
  const recipes: Recipe[] = recipesData;
  const categories = getCategories(recipes);
  const ingredients = getIngredients(recipes);

  const accordionItems = [
    {
      heading: "Categories",
      children: (
        <div className="space-y-2">
          <SearchBar placeholder="Search for a category..." />
          <div className="space-y-1">
            <Checkbox
              label={categories[0]}
              onChange={(values: boolean) => console.log(values)}
            />
            <Checkbox
              label={categories[1]}
              onChange={(values: boolean) => console.log(values)}
            />
            <Checkbox
              label={categories[2]}
              onChange={(values: boolean) => console.log(values)}
            />
          </div>
          <div>
            <a className="h3 underline">
              Show {categories.slice(3).length} more categories
            </a>
          </div>
        </div>
      ),
    },
    {
      heading: "Ingredients",
      children: (
        <>
          <div className="space-y-2">
            <SearchBar placeholder="Search for an ingredient..." />
            <div className="space-y-1">
              <Checkbox
                label={ingredients[0]}
                onChange={(values: boolean) => console.log(values)}
              />
              <Checkbox
                label={ingredients[1]}
                onChange={(values: boolean) => console.log(values)}
              />
              <Checkbox
                label={ingredients[2]}
                onChange={(values: boolean) => console.log(values)}
              />
            </div>
            <div>
              <a className="h3 underline">
                Show {ingredients.slice(3).length} more ingredients
              </a>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="container flex py-4 space-x-2 bg-white bg-opacity-90 fixed z-10">
        <div className="w-full">
          <SearchBar />
        </div>
        <Button border onPress={() => console.log("Hello!")}>
          <AiFillFilter />
        </Button>
        <Button border onPress={() => console.log("Hello!")}>
          <GrRefresh />
        </Button>
      </div>
      <div className="container pt-20">
        <div className="tw p-4 pb-1 space-y-3">
          <Switch
            label="My Favourites (3)"
            onChange={() => console.log("Hello!")}
          />
          <hr />
          <Switch
            label="My Recipes (2)"
            onChange={() => console.log("Hello!")}
          />
          <hr />
          <div>
            <h3>Serving Time</h3>
            <Slider
              min={25}
              max={75}
              onChange={(values: number[]) => console.log(values)}
            />
          </div>
          <Accordion items={accordionItems} />
        </div>
      </div>
      <div className="container mt-5">
        <RecipeCardList />
      </div>
    </>
  );
};

export default BrowsePage;
