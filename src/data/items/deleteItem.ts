import { prisma } from "@/lib/prisma";
import { itemWithRelationsInclude } from "@/data/fragments/query-fragments";

export async function deleteItem(itemId: string) {
  return await prisma.item.delete({
    where: { id: itemId },
    include: itemWithRelationsInclude,
  });
}
