import { Hono } from "hono";

import { authenticate } from "../../../core/middleware/auth.middleware";
import userController from "../controllers/_user.controller";

import favouritesRoutes from "./favourites.routes";

const userRoutes = new Hono();

userRoutes.get("/", authenticate, userController.getUserInfo);
userRoutes.route("/favourites", favouritesRoutes);

export default userRoutes;
