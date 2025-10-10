import { prisma } from "@/lib/prisma";
import { AdminUser } from "@/data/types";

export async function getAllUsers(): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      favouriteRecipeIds: true,
      _count: {
        select: {
          createdRecipes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    _count: {
      createdRecipes: user._count.createdRecipes,
      favouriteRecipes: user.favouriteRecipeIds.length,
    },
  }));
}
