import { Router } from "express";
import { User } from "../models/user.model.js";
import { getMonthlyReport } from "../services/reportService.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";

// Fixed categories order for the response
const CATEGORIES = ["food", "education", "health", "housing", "sports"];

const router = Router();

// GET /api/report?id=123123&year=2025&month=9
router.get("/", async (req, res) => {
  try {
    await logEndpointAccess("/api/report");

    const userId = Number(req.query.id);
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({ error: "id must be an integer" });
    }
    if (!Number.isInteger(year)) {
      return res.status(400).json({ error: "year must be an integer" });
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res
        .status(400)
        .json({ error: "month must be an integer between 1 and 12" });
    }

    const userExists = await User.exists({ id: userId });
    if (!userExists) {
      return res.status(404).json({ error: "user not found" });
    }

    const report = await getMonthlyReport(userId, year, month);

    // normalize to exact shape & order
    const bucketsByCategory = new Map();
    for (const entry of Array.isArray(report.costs) ? report.costs : []) {
      const key = Object.keys(entry)[0];
      if (CATEGORIES.includes(key)) {
        bucketsByCategory.set(key, Array.isArray(entry[key]) ? entry[key] : []);
      }
    }

    const normalizedCosts = CATEGORIES.map((category) => {
      const items = (bucketsByCategory.get(category) ?? [])
        .map((item) => ({
          sum: Number(item.sum),
          description: String(item.description ?? ""),
          day: Number(item.day),
        }))
        .sort((a, b) => a.day - b.day); // stable by day
      return { [category]: items };
    });

    // final payload
    return res.json({
      userid: userId,
      year,
      month,
      costs: normalizedCosts,
    });
  } catch (err) {
    return res.status(400).json({ error: err?.message ?? "unknown error" });
  }
});

export default router;
