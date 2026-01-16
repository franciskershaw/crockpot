import "dotenv/config";

import { serve } from "@hono/node-server";

import { createApp } from "./app";
import { disconnectPrisma, prisma } from "./core/config/prisma/client";

const PORT = Number(process.env.PORT) || 5100;

const start = async () => {
  try {
    // Test Prisma connection
    console.log(
      "-------------------------------------------------------------"
    );
    console.log("Testing database connection...");
    await prisma.$connect();
    console.log("Database connection successful");
    console.log(
      "-------------------------------------------------------------"
    );

    // Create Hono app
    const app = createApp();

    // Start server
    serve({ fetch: app.fetch, port: PORT }, (info) => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${info.port}`
      );
      console.log(
        "-------------------------------------------------------------"
      );
    });

    // Graceful shutdown handlers
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      await disconnectPrisma();
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully");
      await disconnectPrisma();
      process.exit(0);
    });
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : err}`);
    await disconnectPrisma();
    process.exit(1);
  }
};

start();
