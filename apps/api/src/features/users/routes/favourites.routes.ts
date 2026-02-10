import { Hono } from "hono";

import { authenticate } from "../../../core/middleware/auth.middleware";
import { validate } from "../../../core/utils/validate";
import favouritesControllers from "../controllers/favourites/_favourites.controller";
import { favouritesSchema } from "../validation/favourites.user.validation";

const favouritesRoutes = new Hono();

// Get user's favourite recipes
favouritesRoutes.get(
  "/",
  authenticate,
  favouritesControllers.getUserFavourites
);

// Add recipe to favourites
favouritesRoutes.post(
  "/",
  authenticate,
  validate("json", favouritesSchema),
  favouritesControllers.addToFavourites
);

// Remove recipe from favourites
favouritesRoutes.delete(
  "/",
  authenticate,
  validate("json", favouritesSchema),
  favouritesControllers.removeFromFavourites
);

export default favouritesRoutes;
