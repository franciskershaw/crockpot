import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

export async function createItemCategory(data: {
  name: string;
  faIcon: string;
}) {
  const created = await prisma.itemCategory.create({ data });
  if (!created) throw new ValidationError("Failed to create item category");
  return created;
}
