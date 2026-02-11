import { Suspense } from "react";

import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import FavouritesSkeleton from "./components/Favourites/FavouritesSkeleton";
import RecipeFavouritesWithData from "./components/Favourites/RecipeFavouritesWithData";
// import MenuSkeleton from "./components/Menu/MenuSkeleton";
import RecipeMenu from "./components/Menu/RecipeMenu";
// import RecipeMenuWithData from "./components/Menu/RecipeMenuWithData";
import RecipeUserRecipes from "./components/UserRecipes/RecipeUserRecipes";

export const metadata: Metadata = {
  title: "Your Crockpot",
  description:
    "Manage your personal recipe collection, favorites, and meal planning. Create your weekly menu and generate shopping lists automatically.",
  robots: {
    index: false,
    follow: true,
  },
};

const YourCrockpotPage = () => {
  return (
    <div className="container mx-auto px-2 py-6 max-w-7xl">
      {/* Static content - renders immediately */}
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Your Crockpot
        </h1>
        <p className="text-gray-600">
          Manage your recipes, favorites, and meal planning
        </p>
      </div>

      {/* Tabs UI renders immediately */}
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger className="text-base" value="menu">
            Menu
          </TabsTrigger>
          <TabsTrigger className="text-base" value="favourites">
            Favourites
          </TabsTrigger>
          <TabsTrigger className="text-base" value="my-recipes">
            My Recipes
          </TabsTrigger>
        </TabsList>
        {/* Menu tab - streams in with Suspense */}
        <TabsContent value="menu">
          {/* <Suspense fallback={<MenuSkeleton />}> */}
          <RecipeMenu />
          {/* </Suspense> */}
        </TabsContent>

        {/* <TabsContent value="favourites">
          <Suspense fallback={<FavouritesSkeleton />}>
            <RecipeFavouritesWithData />
          </Suspense>
        </TabsContent> */}
        {/* <TabsContent value="my-recipes">
          <RecipeUserRecipes />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default YourCrockpotPage;
