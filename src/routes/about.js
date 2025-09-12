import { Router } from "express";
import { logEndpointAccess } from "../middleware/requestLogger.js";
import team from "../config/team.js";

const router = Router();

// GET /api/about
router.get("/", async (_req, res) => {
  try {
    await logEndpointAccess("/api/about");
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "unknown error" });
  }
});

export default router;
