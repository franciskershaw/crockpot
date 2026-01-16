"use server";

import { getUnits as getUnitsFromDAL } from "@/data/units/getUnits";
import { getUnitsWithUsage as getUnitsWithUsageFromDAL } from "@/data/units/getUnitsWithUsage";
import { createUnit as createUnitFromDAL } from "@/data/units/createUnit";
import { updateUnit as updateUnitFromDAL } from "@/data/units/updateUnit";
import { deleteUnit as deleteUnitFromDAL } from "@/data/units/deleteUnit";
import { getUnitById } from "@/data/units/getUnitById";
import { getUnitUsageCount } from "@/data/units/getUnitUsageCount";
import {
  createPublicAction,
  Permission,
  withPermission,
  withPermissionAndValidation,
  revalidateItemCache,
} from "@/lib/action-helpers";
import { createUnitSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/errors";

export const getUnits = createPublicAction(async () => {
  return await getUnitsFromDAL();
});

export const getUnitsWithUsage = createPublicAction(async () => {
  return await getUnitsWithUsageFromDAL();
});

export const createUnit = withPermissionAndValidation(
  Permission.CREATE_UNITS,
  createUnitSchema,
  async (validatedInput) => {
    const unit = await createUnitFromDAL(validatedInput);

    // Revalidate units cache
    await revalidateItemCache({
      includeTags: ["units"],
      includePaths: ["/admin/units"],
    });

    return {
      success: true,
      unit,
      message: "Unit created successfully!",
    };
  }
);

export const updateUnit = withPermission(
  Permission.CREATE_UNITS,
  async (
    _user,
    data: { name?: string; abbreviation?: string },
    unitId: string
  ) => {
    const unit = await updateUnitFromDAL(unitId, data);

    // Revalidate units cache
    await revalidateItemCache({
      includeTags: ["units"],
      includePaths: ["/admin/units"],
    });

    return {
      success: true,
      unit,
      message: "Unit updated successfully!",
    };
  }
);

export const deleteUnit = withPermission(
  Permission.CREATE_UNITS,
  async (_user, unitId: string) => {
    // Prevent deleting the default unit (empty name and abbreviation)
    const unit = await getUnitById(unitId);

    if (!unit) {
      throw new ValidationError("Unit not found");
    }

    const isDefaultUnit =
      unit.name.trim() === "" && unit.abbreviation.trim() === "";
    if (isDefaultUnit) {
      throw new ValidationError("The default unit cannot be deleted.");
    }

    // Prevent deleting if any items explicitly include this unit
    const itemUsageCount = await getUnitUsageCount(unitId);

    if (itemUsageCount > 0) {
      throw new ValidationError(
        "This unit is currently in use by one or more items. Remove it from those items first."
      );
    }

    const deletedUnit = await deleteUnitFromDAL(unitId);

    // Revalidate units cache
    await revalidateItemCache({
      includeTags: ["units"],
      includePaths: ["/admin/units"],
    });

    return {
      success: true,
      unit: deletedUnit,
      message: "Unit deleted successfully!",
    };
  }
);
