import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prisma } from "./core/config/prisma/client";

export const createApp = () => {
  const app = new Hono();

  // Logger middleware
  app.use(logger());

  // TODO: Security headers middleware
  // app.use(securityHeaders);

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

  // Welcome / health check route
  app.get("/", (c) =>
    c.json(
      { message: "Welcome to the Crockpot API (Hono + Prisma edition" },
      200
    )
  );

  // Test database connection route
  app.get("/db-test", async (c) => {
    try {
      // Simple query to test connection
      const userCount = await prisma.user.count();
      return c.json({ status: "connected", userCount });
    } catch (error) {
      return c.json(
        { status: "error", message: (error as Error).message },
        500
      );
    }
  });

  // TODO: Error handling middleware
  // app.onError(errorHandler);

  return app;
};
