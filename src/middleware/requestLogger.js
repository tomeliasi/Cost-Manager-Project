import { Log } from "../models/log.model.js";

export async function mongoRequestLogger(req, res, next) {
  const start = Date.now();
  res.on("finish", async () => {
    try {
      await Log.create({
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration_ms: Date.now() - start,
        at: new Date(),
      });
    } catch (_) {}
  });
  next();
}

export async function logEndpointAccess(name) {
  try {
    await Log.create({
      method: "INTERNAL",
      path: name,
      status: 0,
      duration_ms: 0,
      at: new Date(),
    });
  } catch (_) {}
}
