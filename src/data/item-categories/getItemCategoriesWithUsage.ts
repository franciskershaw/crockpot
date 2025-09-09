import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/constants";

export interface ItemCategoryWithUsage {
  id: string;
  name: string;
  faIcon: string;
  createdAt: Date;
  updatedAt: Date;
  itemUsageCount: number;
}

export async function getItemCategoriesWithUsage(): Promise<
  ItemCategoryWithUsage[]
> {
  const { unstable_cache } = await import("next/cache");

  const getCached = unstable_cache(
    async () => {
      const categories = await prisma.itemCategory.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      });

      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        faIcon: category.faIcon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        itemUsageCount: category._count.items,
      }));
    },
    ["item-categories-with-usage"],
    {
      tags: [tags.ITEM_CATEGORIES],
      revalidate: 60,
    }
  );

  return getCached();
}
