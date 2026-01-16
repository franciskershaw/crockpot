import { prisma } from "@/lib/prisma";
import { Unit } from "@/data/types";
import { ValidationError } from "@/lib/errors";

/**
 * Deletes a unit from the database
 * @param unitId - The ID of the unit to delete
 * @returns The deleted unit
 */
export async function deleteUnit(unitId: string): Promise<Unit> {
  const deletedUnit = await prisma.unit.delete({
    where: { id: unitId },
  });

  if (!deletedUnit) {
    throw new ValidationError("Failed to delete unit");
  }

  return deletedUnit;
}
