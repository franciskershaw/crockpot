import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/constants";

export async function getUnits() {
  const { unstable_cache } = await import("next/cache");

  const getCachedUnits = unstable_cache(
    async () => {
      const units = await prisma.unit.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return units;
    },
    [tags.UNITS],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [tags.UNITS],
    }
  );

  return getCachedUnits();
}
