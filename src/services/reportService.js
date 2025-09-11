import { Cost } from "../models/cost.model.js";
import { Report } from "../models/report.model.js";
import { CATEGORIES, isPastMonth } from "../utils/validate.js";

function emptyCostsBuckets() {
  return CATEGORIES.map((c) => ({ [c]: [] }));
}

function formatReportSkeleton(userid, year, month) {
  return { userid, year, month, costs: emptyCostsBuckets() };
}

function pushCost(skel, cost) {
  const entry = {
    sum: Number(cost.sum),
    description: cost.description,
    day: cost.day,
  };
  const bucket = skel.costs.find((b) =>
    Object.prototype.hasOwnProperty.call(b, cost.category)
  );
  bucket[cost.category].push(entry);
}

export async function getMonthlyReport(userid, year, month) {
  const y = Number(year),
    m = Number(month),
    u = Number(userid);

  if (isPastMonth(y, m)) {
    const cached = await Report.findOne({
      userid: u,
      year: y,
      month: m,
    }).lean();
    if (cached) return cached;
  }

  const items = await Cost.find({ userid: u, year: y, month: m }).lean();
  const report = formatReportSkeleton(u, y, m);
  items.forEach((c) => pushCost(report, c));

  if (isPastMonth(y, m)) {
    try {
      await Report.create(report);
    } catch (_) {}
  }
  return report;
}
