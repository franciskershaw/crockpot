import { getItems } from "@/actions/items";
import { getUnits } from "@/actions/units";
import RecipeMenu from "./RecipeMenu";

/**
 * Server component wrapper that fetches static reference data
 * and passes it to the client RecipeMenu component
 */
export default async function RecipeMenuWithData() {
  // Only fetch static reference data on server
  // User-specific data (menu, shopping list) is fetched client-side for caching
  const [items, units] = await Promise.all([getItems(), getUnits()]);

  return <RecipeMenu items={items} units={units} />;
}
