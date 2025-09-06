import { prisma } from "@/lib/prisma";
import { UserRole } from "@/data/types";

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    createdRecipes: number;
    favouriteRecipes: number;
  };
}

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

  // Transform the data to include the correct favourite count
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
