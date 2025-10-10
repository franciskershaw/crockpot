import { getItems } from "@/actions/items";
import { ItemsDataTable } from "./components/ItemsDataTable";

export default async function ItemsPage() {
  const items = await getItems();

  return <ItemsDataTable data={items} />;
}
