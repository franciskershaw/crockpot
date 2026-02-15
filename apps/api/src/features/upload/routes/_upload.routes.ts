import { Hono } from "hono";

import { authenticate } from "../../../core/middleware/auth.middleware";
import uploadControllers from "../controllers/_upload.controller";

const uploadRoutes = new Hono();

uploadRoutes.post("/sign", authenticate, uploadControllers.generateSignature);

export default uploadRoutes;
