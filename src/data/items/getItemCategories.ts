import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/constants";

export async function getItemCategories() {
  const { unstable_cache } = await import("next/cache");

  const getCachedCategories = unstable_cache(
    async () => {
      const categories = await prisma.itemCategory.findMany({
        orderBy: { name: "asc" },
      });
      return categories;
    },
    [tags.CATEGORIES],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [tags.CATEGORIES],
    }
  );

  return getCachedCategories();
}
