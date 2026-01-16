import { prisma } from "@/lib/prisma";

/**
 * Returns the number of items that explicitly include this unit in allowedUnitIds
 */
export async function getUnitUsageCount(unitId: string): Promise<number> {
  return prisma.item.count({
    where: {
      allowedUnitIds: {
        has: unitId,
      },
    },
  });
}
