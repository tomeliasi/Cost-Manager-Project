import { Router } from "express";
import { getMonthlyReport } from "../services/reportService.js";
import { logEndpointAccess } from "../middleware/requestLogger.js";
const CATEGORIES = ["food", "health", "housing", "sports", "education"];

const router = Router();

router.get("/", async (req, res) => {
  try {
    await logEndpointAccess("/api/report");

    const { id, year, month } = req.query;
    const userid = Number(id);
    if (!Number.isInteger(userid)) {
      return res.status(400).json({ error: "id must be an integer" });
    }
    const y = Number(year);
    if (!Number.isInteger(y)) {
      return res.status(400).json({ error: "year must be an integer" });
    }
    const m = Number(month);
    if (!Number.isInteger(m) || m < 1 || m > 12) {
      return res.status(400).json({ error: "month must be an integer between 1 and 12" });
    }

    // Build (and possibly load cached) report via the service.
    // The service should implement the Computed Design Pattern:
    //  - If (y,m) is in the past: read cached report if exists; otherwise compute once and save.
    //  - If current/future: compute fresh without caching.
    const report = await getMonthlyReport(userid, y, m);

    // Ensure the response matches the exact JSON shape and category order required by the spec:
    // - costs must be an array with exactly one object per category key, in the defined order
    // - each item array contains { sum, description, day } objects
    // - categories with no items must exist with an empty array
    const bucketsByCat = new Map();
    // Normalize any incoming shape into a map for easy merge
    for (const entry of Array.isArray(report.costs) ? report.costs : []) {
      const k = Object.keys(entry)[0];
      if (CATEGORIES.includes(k)) bucketsByCat.set(k, Array.isArray(entry[k]) ? entry[k] : []);
    }

    const normalizedCosts = CATEGORIES.map((cat) => {
      const items = (bucketsByCat.get(cat) ?? []).map((it) => ({
        // Keep property names exactly as in the costs documents:
        sum: Number(it.sum),                      // ensure numeric
        description: String(it.description ?? ""),// ensure string
        day: Number(it.day),                      // derived from cost.date by service
      }))
      // Optional: stable ordering by day ascending for readability
      .sort((a, b) => a.day - b.day);

      return { [cat]: items };
    });

    // Send the final, spec-compliant payload
    return res.json({ userid, year: y, month: m, costs: normalizedCosts });
  } catch (err) {
    // Return JSON error per requirement
    return res.status(400).json({ error: err?.message ?? "unknown error" });
  }
});

export default router;
