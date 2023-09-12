"use client";

import React from "react";
import Switch from "@/src/components/Switch/Switch";
import Slider from "@/src/components/Slider/Slider";
import Checkbox from "@/src/components/Checkbox/Checkbox";
import SearchBar from "@/src/components/FormSearchBar/SearchBar";
import recipesData from "../../../data/recipes.json";
import {
  getCategories,
  getMinMaxCookingTime,
} from "@/src/hooks/recipeFunctions";
import { useState } from "react";

interface Recipe {
  imageUrl: string;
  cookingTime: number;
  recipeName: string;
  ingredients: string[];
  categories: string[];
}

function BrowsePageFiltersMenu() {
  const recipes: Recipe[] = recipesData;
  const categories = getCategories(recipes);
  const cookingTime = getMinMaxCookingTime(recipes);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-3">
      <Switch
        label="My Favourites (3)"
        onChange={() => console.log("Hello!")}
      />
      <hr />
      <Switch label="My Recipes (2)" onChange={() => console.log("Hello!")} />
      <hr />
      <div>
        <h3>Serving Time</h3>
        <Slider
          min={cookingTime.min}
          max={cookingTime.max}
          onChange={(values: number[]) => console.log(values)}
        />
      </div>
      <hr />
      <div>
        <h3 className="mb-2">Categories</h3>
        <div className="space-y-2">
          <SearchBar
            placeholder="Search for a category..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <div className="space-y-1">
            {categories
              .filter((category) =>
                category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((category, index) => (
                <Checkbox
                  key={index}
                  label={category}
                  onChange={(value: boolean) => console.log(value)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowsePageFiltersMenu;
