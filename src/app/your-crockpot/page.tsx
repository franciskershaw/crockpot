import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeMenuWithData from "./components/Menu/RecipeMenuWithData";
import RecipeFavouritesWithData from "./components/Favourites/RecipeFavouritesWithData";
import RecipeUserRecipes from "./components/UserRecipes/RecipeUserRecipes";
import MenuSkeleton from "./components/Menu/MenuSkeleton";
import FavouritesSkeleton from "./components/Favourites/FavouritesSkeleton";

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
          <Suspense fallback={<MenuSkeleton />}>
            <RecipeMenuWithData />
          </Suspense>
        </TabsContent>

        {/* Favourites tab - streams in with Suspense */}
        <TabsContent value="favourites">
          <Suspense fallback={<FavouritesSkeleton />}>
            <RecipeFavouritesWithData />
          </Suspense>
        </TabsContent>

        <TabsContent value="my-recipes">
          <RecipeUserRecipes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YourCrockpotPage;
