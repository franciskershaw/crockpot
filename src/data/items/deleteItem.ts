import { prisma } from "@/lib/prisma";

export async function deleteItem(itemId: string) {
  const deletedItem = await prisma.item.delete({
    where: { id: itemId },
  });

  return deletedItem;
}
