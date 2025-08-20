import { prisma } from "../../../prisma/prisma";

export async function getUnits() {
  const units = await prisma.unit.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return units;
}
