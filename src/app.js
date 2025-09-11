import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { httpLogger } from "./services/logger.js";
import { mongoRequestLogger } from "./middleware/requestLogger.js";
import about from "./routes/about.js";
import users from "./routes/users.js";
import add from "./routes/add.js";
import report from "./routes/report.js";
import logs from "./routes/logs.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

export function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);
  app.use(mongoRequestLogger);

  app.use("/api/about", about);
  app.use("/api/users", users);
  app.use("/api/add", add); // גם add user וגם add cost (ע"פ גוף הבקשה)
  app.use("/api/report", report);
  app.use("/api/logs", logs);

  app.use(errorHandler);
  return app;
}
