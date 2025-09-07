import { getItems, getItemCategories } from "@/actions/items";
import { getUnits } from "@/actions/units";
import { ItemsDataTable } from "./components/ItemsDataTable";

export default async function ItemsPage() {
  const [items, categories, units] = await Promise.all([
    getItems(),
    getItemCategories(),
    getUnits(),
  ]);

  return (
    <div className="bg-white rounded-lg border p-6">
      <ItemsDataTable data={items} categories={categories} units={units} />
    </div>
  );
}
