import { Router } from "express";
import { Log } from "../models/log.model.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";

const router = Router();

// GET /api/logs → last 1000 logs
router.get("/", async (_req, res, next) => {
  try {
    await logEndpointAccess("/api/logs");
    const logs = await Log.find().sort({ at: -1 }).limit(1000).lean();
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

export default router;
