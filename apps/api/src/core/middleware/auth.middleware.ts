import { Context, Next } from "hono";

import { ROLE_HIERARCHY, UserRole } from "../../shared/types";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";
import { TokenPayload, verifyAccessToken } from "../utils/jwt";

export const authenticate = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("No token provided", "TOKEN_MISSING");
  }

  const decoded = await verifyAccessToken(token);

  if (!decoded) {
    throw new UnauthorizedError(
      "Invalid or expired access token",
      "INVALID_ACCESS_TOKEN"
    );
  }

  c.set("user", decoded);

  await next();
};

/**
 * Returns middleware that restricts the route to users with at least the given role.
 * Uses ROLE_HIERARCHY from shared (FREE < PREMIUM < PRO < ADMIN).
 * Must be used after `authenticate` so `user` is set on the context.
 */
export const requireRole = (minimumRole: UserRole) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user") as TokenPayload | undefined;

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const userRank = ROLE_HIERARCHY[user.role as UserRole];
    const requiredRank = ROLE_HIERARCHY[minimumRole];

    if (userRank === undefined || userRank < requiredRank) {
      throw new ForbiddenError(
        `This action requires ${minimumRole} role or higher`
      );
    }

    await next();
  };
};
