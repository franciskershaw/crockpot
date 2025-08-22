import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecipeMenu from "./components/Menu/RecipeMenu";
import RecipeFavourites from "./components/Favourites/RecipeFavourites";
import RecipeUserRecipes from "./components/UserRecipes/RecipeUserRecipes";
import { getShoppingList, getUserMenu } from "@/actions/menu";
import { getUserFavourites } from "@/actions/favourites";
import { getUserCreatedRecipes } from "@/actions/user-recipes";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const dynamic = "force-dynamic";

const YourCrockpotPage = async () => {
  const menu = await getUserMenu();

  // React Query SSR prefetch for shopping list to hydrate client cache
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["shopping-list"],
    queryFn: getShoppingList,
  });

  await queryClient.prefetchQuery({
    queryKey: ["favourites"],
    queryFn: getUserFavourites,
  });

  await queryClient.prefetchQuery({
    queryKey: ["user-recipes"],
    queryFn: getUserCreatedRecipes,
  });

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

      <HydrationBoundary state={dehydrate(queryClient)}>
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
            <RecipeMenu menu={menu} />
          </TabsContent>

          <TabsContent value="favourites">
            <RecipeFavourites />
          </TabsContent>

          <TabsContent value="my-recipes">
            <RecipeUserRecipes />
          </TabsContent>
        </Tabs>
      </HydrationBoundary>
    </div>
  );
};

export default YourCrockpotPage;
