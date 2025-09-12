import express from "express";
import dotenv from "dotenv";
import { httpLogger } from "./services/logger.js";
import { mongoRequestLogger } from "./middleware/requestLogger.js";
import about from "./routes/about.js";
import users from "./routes/users.js";
import add from "./routes/add.js";
import report from "./routes/report.js";
import logs from "./routes/logs.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config(); // load env vars from .env

export function buildApp() {
  const app = express();

  // Global middlewares
  app.use(express.json());
  app.use(httpLogger); // HTTP logs (Pino)
  app.use(mongoRequestLogger); // persist each request log to MongoDB

  // Routes
  app.use("/api/about", about);
  app.use("/api/users", users);
  app.use("/api/add", add); // add user OR cost (by request body shape)
  app.use("/api/report", report);
  app.use("/api/logs", logs);

  // Error handler
  app.use(errorHandler);

  return app;
}
