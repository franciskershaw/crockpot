import { prisma } from "@/lib/prisma";
import { Unit } from "@/data/types";
import { ValidationError } from "@/lib/errors";
import { UpdateUnitInput } from "@/lib/validations";

/**
 * Updates an existing unit in the database
 * @param unitId - The ID of the unit to update
 * @param unitData - Unit update data
 * @returns The updated unit
 */
export async function updateUnit(
  unitId: string,
  unitData: UpdateUnitInput
): Promise<Unit> {
  const updatedUnit = await prisma.unit.update({
    where: { id: unitId },
    data: unitData,
  });

  if (!updatedUnit) {
    throw new ValidationError("Failed to update unit");
  }

  return updatedUnit;
}
