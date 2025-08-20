import { prisma } from "@/lib/prisma";

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
    ["units"],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ["units"],
    }
  );

  return getCachedUnits();
}
