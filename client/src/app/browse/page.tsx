"use client";

import RecipeCardList from "../../components/RecipeCardList/RecipeCardList";
import FiltersMenu from "./components/FiltersMenu";
import SearchBarAndButtons from "./components/SearchBarAndButtons";

const BrowsePage = () => {
  return (
    <>
      <div className="container flex py-4 space-x-2 bg-white bg-opacity-90 fixed z-10 md:hidden">
        <SearchBarAndButtons />
      </div>
      <div className="container !px-0 md:flex">
        <div className="container pt-20 md:pt-0 md:w-1/3 md:pr-4">
          <div className="md:sticky md:top-[110px]">
            <FiltersMenu />
          </div>
        </div>
        <div className="container mt-5 md:mt-0 md:w-2/3 md:pl-4">
          <div className="hidden md:flex space-x-2 mb-4">
            <SearchBarAndButtons />
          </div>
          <RecipeCardList />
        </div>
      </div>
    </>
  );
};

export default BrowsePage;
