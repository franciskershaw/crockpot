import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeMenu from "./components/Menu/RecipeMenu";
import RecipeFavourites from "./components/Favourites/RecipeFavourites";
import RecipeUserRecipes from "./components/UserRecipes/RecipeUserRecipes";

export const dynamic = "force-dynamic";

const YourCrockpotPage = () => {
  return (
    <div className="container mx-auto px-2 py-6 max-w-7xl">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Your Crockpot
        </h1>
        <p className="text-gray-600">
          Manage your recipes, favorites, and meal planning
        </p>
      </div>

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

        <TabsContent value="menu">
          <RecipeMenu />
        </TabsContent>

        <TabsContent value="favourites">
          <RecipeFavourites />
        </TabsContent>

        <TabsContent value="my-recipes">
          <RecipeUserRecipes />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YourCrockpotPage;
