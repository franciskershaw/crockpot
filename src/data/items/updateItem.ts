import { prisma } from "@/lib/prisma";
import { updateItemSchema } from "@/lib/validations";

export async function updateItem(
  itemId: string,
  data: { name?: string; categoryId?: string; allowedUnitIds?: string[] }
) {
  // Validate the input
  const validatedInput = updateItemSchema.parse(data);

  const item = await prisma.item.update({
    where: { id: itemId },
    data: validatedInput,
  });

  return item;
}
