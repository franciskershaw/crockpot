import { getItems } from "@/actions/items";
import { ItemsDataTable } from "./components/ItemsDataTable";

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="bg-white rounded-lg border p-6">
      <ItemsDataTable data={items} />
    </div>
  );
}
