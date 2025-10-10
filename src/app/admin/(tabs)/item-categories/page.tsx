import { getItemCategoriesWithUsage } from "@/actions/item-categories";
import { ItemCategoriesDataTable } from "./components/ItemCategoriesDataTable";

export default async function ItemCategoriesPage() {
  const itemCategories = await getItemCategoriesWithUsage();
  return <ItemCategoriesDataTable data={itemCategories} />;
}
