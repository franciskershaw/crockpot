import { prisma } from "@/lib/prisma";
import { UserRole } from "@/data/types";

export interface UpdateUserRoleInput {
  userId: string;
  role: UserRole;
}

export interface UpdateUserRoleResult {
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

export async function updateUserRole(
  data: UpdateUserRoleInput
): Promise<UpdateUserRoleResult> {
  const updatedUser = await prisma.user.update({
    where: {
      id: data.userId,
    },
    data: {
      role: data.role,
    },
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
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
    _count: {
      createdRecipes: updatedUser._count.createdRecipes,
      favouriteRecipes: updatedUser.favouriteRecipeIds.length,
    },
  };
}
