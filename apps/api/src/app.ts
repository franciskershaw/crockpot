import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { errorHandler } from "./core/middleware/error.middleware";
import { securityHeaders } from "./core/middleware/security.middleware";
import authRoutes from "./features/auth/routes/_auth.routes";

export const createApp = () => {
  const app = new Hono();

  // Logger middleware
  app.use(logger());

  // TODO: Security headers middleware
  app.use(securityHeaders);

  // CORS middleware
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Feature routes
  app.route("/api/auth", authRoutes);

  // Welcome / health check route
  app.get("/", (c) =>
    c.json({ message: "Welcome to the Crockpot API (Hono edition" }, 200)
  );

  // TODO: Error handling middleware
  app.onError(errorHandler);

  return app;
};
