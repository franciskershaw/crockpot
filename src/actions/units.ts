"use server";

import { getUnits as getUnitsFromDAL } from "@/data/units/getUnits";
import { createPublicAction } from "@/lib/action-helpers";

export const getUnits = createPublicAction(async () => {
  return await getUnitsFromDAL();
});
