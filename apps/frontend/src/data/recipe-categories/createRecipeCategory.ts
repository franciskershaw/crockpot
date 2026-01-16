import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";

export async function createRecipeCategory(data: { name: string }) {
  const created = await prisma.recipeCategory.create({ data });
  if (!created) throw new ValidationError("Failed to create category");
  return created;
}


