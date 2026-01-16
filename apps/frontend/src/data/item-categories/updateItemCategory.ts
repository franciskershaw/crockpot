import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

export async function updateItemCategory(
  id: string,
  data: { name?: string; faIcon?: string }
) {
  const updated = await prisma.itemCategory.update({ where: { id }, data });
  if (!updated) throw new ValidationError("Failed to update item category");
  return updated;
}
