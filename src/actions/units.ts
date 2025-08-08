"use server";

import { getUnits as getUnitsFromDAL } from "@/data/units/getUnits";

export async function getUnits() {
  return await getUnitsFromDAL();
}
