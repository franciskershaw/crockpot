import { prisma } from "@/lib/prisma";
import { tags } from "@/lib/constants";

export interface UnitWithUsage {
  id: string;
  name: string;
  abbreviation: string;
  createdAt: Date;
  updatedAt: Date;
  itemUsageCount: number; // Number of items that explicitly allow this unit
}

export async function getUnitsWithUsage() {
  const { unstable_cache } = await import("next/cache");

  const getCachedUnitsWithUsage = unstable_cache(
    async () => {
      const units = await prisma.unit.findMany({
        orderBy: {
          name: "asc",
        },
      });

      // Get usage count for each unit by counting items that have this unit in allowedUnitIds
      const unitsWithUsage = await Promise.all(
        units.map(async (unit) => {
          const itemUsageCount = await prisma.item.count({
            where: {
              allowedUnitIds: {
                has: unit.id,
              },
            },
          });

          return {
            ...unit,
            itemUsageCount,
          };
        })
      );

      return unitsWithUsage;
    },
    [tags.UNITS, "with-usage"],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: [tags.UNITS],
    }
  );

  return getCachedUnitsWithUsage();
}
