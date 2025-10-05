import { prisma } from "@/lib/prisma";

/**
 * Get the number of recipes created by a user
 * @param userId - The ID of the user
 * @returns The number of recipes created by the user
 */
export async function getUserRecipeCount(userId: string): Promise<number> {
  return prisma.recipe.count({ where: { createdById: userId } });
}
