import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/constants";

export interface RecipeCategoryWithUsage {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  recipeUsageCount: number;
}

export async function getRecipeCategoriesWithUsage(): Promise<RecipeCategoryWithUsage[]> {
  const { unstable_cache } = await import("next/cache");

  const getCached = unstable_cache(
    async () => {
      const categories = await prisma.recipeCategory.findMany({
        orderBy: { name: "asc" },
      });

      const withUsage = await Promise.all(
        categories.map(async (cat) => {
          const recipeUsageCount = await prisma.recipe.count({
            where: {
              categoryIds: {
                has: cat.id,
              },
            },
          });
          return { ...cat, recipeUsageCount };
        })
      );

      return withUsage;
    },
    [tags.CATEGORIES, "with-usage"],
    {
      revalidate: 3600,
      tags: [tags.CATEGORIES],
    }
  );

  return getCached();
}


