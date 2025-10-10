import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

export async function deleteItemCategory(id: string) {
  const deleted = await prisma.itemCategory.delete({ where: { id } });
  if (!deleted) throw new ValidationError("Failed to delete item category");
  return deleted;
}
