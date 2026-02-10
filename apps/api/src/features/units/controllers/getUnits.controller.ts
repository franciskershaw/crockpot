import { Context } from "hono";

import Unit from "../model/unit.model";

const getUnits = async (c: Context) => {
  const units = await Unit.find().sort({ name: 1 }).lean();

  return c.json(units, 200);
};

export default getUnits;
