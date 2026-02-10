import { Hono } from "hono";

import unitControllers from "../controllers/_units.controller";

const unitRoutes = new Hono();

unitRoutes.get("/", unitControllers.getUnits);

export default unitRoutes;
