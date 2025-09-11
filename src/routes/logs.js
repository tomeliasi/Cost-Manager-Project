import { Router } from "express";
import { Log } from "../models/log.model.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";

const router = Router();
router.get("/", async (req, res, next) => {
  try {
    await logEndpointAccess("/api/logs");
    const logs = await Log.find().sort({ at: -1 }).lean();
    res.json(logs);
  } catch (e) {
    next(e);
  }
});
export default router;
