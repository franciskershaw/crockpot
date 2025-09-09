import { prisma } from "@/lib/prisma";
import { Unit } from "@/data/types";

export async function getUnitById(unitId: string): Promise<Unit | null> {
  return prisma.unit.findUnique({ where: { id: unitId } });
}
