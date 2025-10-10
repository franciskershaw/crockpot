import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

export async function updateRecipeCategory(
  id: string,
  data: { name?: string }
) {
  const updated = await prisma.recipeCategory.update({ where: { id }, data });
  if (!updated) throw new ValidationError("Failed to update category");
  return updated;
}


