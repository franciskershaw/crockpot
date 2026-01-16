import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

export async function deleteRecipeCategory(id: string) {
  const deleted = await prisma.recipeCategory.delete({ where: { id } });
  if (!deleted) throw new ValidationError("Failed to delete category");
  return deleted;
}


