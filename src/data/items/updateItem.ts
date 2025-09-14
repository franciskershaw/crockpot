import { prisma } from "@/lib/prisma";
import { updateItemSchema } from "@/lib/validations";
import { itemWithRelationsInclude } from "@/data/fragments/query-fragments";

export async function updateItem(
  itemId: string,
  data: { name?: string; categoryId?: string; allowedUnitIds?: string[] }
) {
  // Validate the input
  const validatedInput = updateItemSchema.parse(data);

  return await prisma.item.update({
    where: { id: itemId },
    data: validatedInput,
    include: itemWithRelationsInclude,
  });
}
