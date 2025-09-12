import pino from "pino";
import pinoHttp from "pino-http";

// Use quiet logs in tests, info otherwise
const logLevel = process.env.NODE_ENV === "test" ? "silent" : "info";

export const logger = pino({ level: logLevel });

// Attach request/response logs to Express
export const httpLogger = pinoHttp({ logger });
