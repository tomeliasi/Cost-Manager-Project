import { Router } from "express";
import { logEndpointAccess } from "../middleware/requestLogger.js";
import team from "../config/team.js";

const router = Router();
router.get("/", async (req, res) => {
  try {
    await logEndpointAccess("/api/about");
    return res.json(team);
  } catch (err) {
    return res.status(500).json({ error: err?.message ?? "unknown error" });
  }
});

export default router;
