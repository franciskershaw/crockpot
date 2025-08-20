import { prisma } from "@/lib/prisma";

export async function getUnits() {
  const units = await prisma.unit.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return units;
}
