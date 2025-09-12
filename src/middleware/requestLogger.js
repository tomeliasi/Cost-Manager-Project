import { Log } from "../models/log.model.js";

// Logs every HTTP request after the response is sent
export function mongoRequestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    Log.create({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Date.now() - startedAt,
      at: new Date(),
    }).catch(() => {});
  });

  next();
}

// Marks an explicit endpoint access (manual marker inside routes)
export function logEndpointAccess(path) {
  return Log.create({
    method: "INTERNAL",
    path,
    status: 0,
    duration_ms: 0,
    at: new Date(),
  }).catch(() => {});
}
