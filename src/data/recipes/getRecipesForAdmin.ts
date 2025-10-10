import { prisma } from "@/lib/prisma";

export interface AdminRecipe {
  id: string;
  name: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  categories: {
    id: string;
    name: string;
  }[];
  _count: {
    ingredients: number;
    instructions: number;
    categories: number;
  };
}

export async function getRecipesForAdminPanel(): Promise<AdminRecipe[]> {
  const recipes = await prisma.recipe.findMany({
    select: {
      id: true,
      name: true,
      approved: true,
      createdAt: true,
      updatedAt: true,
      ingredients: true, // Get full array to count
      instructions: true, // Get full array to count
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          categories: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform to AdminRecipe format
  return recipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    approved: recipe.approved,
    createdAt: recipe.createdAt,
    updatedAt: recipe.updatedAt,
    createdBy: recipe.createdBy,
    categories: recipe.categories,
    _count: {
      ingredients: recipe.ingredients.length,
      instructions: recipe.instructions.length,
      categories: recipe._count.categories,
    },
  }));
}
