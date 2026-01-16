import { prisma } from "@/lib/prisma";
import { Unit } from "@/data/types";
import { ValidationError } from "@/lib/errors";
import { CreateUnitInput } from "@/lib/validations";

/**
 * Creates a new unit in the database
 * @param unitData - Unit creation data
 * @returns The created unit
 */
export async function createUnit(unitData: CreateUnitInput): Promise<Unit> {
  const createdUnit = await prisma.unit.create({
    data: unitData,
  });

  if (!createdUnit) {
    throw new ValidationError("Failed to create unit");
  }

  return createdUnit;
}
