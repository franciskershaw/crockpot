import { deleteItem } from "@/actions/items";
import { toast } from "sonner";

export async function deleteItemAction(itemId: string, onConfirm?: () => void) {
  try {
    await deleteItem(itemId);
    toast.success("Item deleted successfully");
    onConfirm?.();
  } catch (error) {
    console.error("Delete item error:", error);
    toast.error("Failed to delete item");
  }
}

export async function deleteItems(itemIds: string[], onConfirm?: () => void) {
  try {
    // Delete items in parallel
    await Promise.all(itemIds.map((id) => deleteItem(id)));
    toast.success(`${itemIds.length} item(s) deleted successfully`);
    onConfirm?.();
  } catch (error) {
    console.error("Bulk delete error:", error);
    toast.error("Failed to delete items");
  }
}
