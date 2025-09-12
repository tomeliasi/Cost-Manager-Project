import { Cost } from "../models/cost.model.js";
import { Report } from "../models/report.model.js";
import { CATEGORIES, isPastMonth } from "../utils/validate.js";

// Empty buckets in fixed order
function makeEmptyBuckets() {
  return CATEGORIES.map((name) => ({ [name]: [] }));
}

// Base shape of a report
function makeReport(userid, year, month) {
  return { userid, year, month, costs: makeEmptyBuckets() };
}

// Push a single cost into the right bucket
function addCostToReport(report, costDoc) {
  const day = new Date(costDoc.date).getUTCDate();
  const item = {
    sum: Number(costDoc.sum),
    description: String(costDoc.description ?? ""),
    day: Number(day),
  };
  const bucket = report.costs.find((b) => Object.hasOwn(b, costDoc.category));
  if (bucket) bucket[costDoc.category].push(item);
}

// Main entry: get monthly report
export async function getMonthlyReport(userid, year, month) {
  const uid = Number(userid);
  const _year = Number(year);
  const _month = Number(month);

  const monthStart = new Date(Date.UTC(_year, _month - 1, 1, 0, 0, 0));
  const nextMonthStart = new Date(Date.UTC(_year, _month, 1, 0, 0, 0));

  // Past month → try cache first
  if (isPastMonth(_year, _month)) {
    const cached = await Report.findOne({
      userid: uid,
      year: _year,
      month: _month,
    }).lean();
    if (cached) return cached;
  }

  // Query costs by date range
  const costs = await Cost.find({
    userid: uid,
    date: { $gte: monthStart, $lt: nextMonthStart },
  }).lean();

  // Build fresh report
  const report = makeReport(uid, _year, _month);
  costs.forEach((cost) => addCostToReport(report, cost));

  // Sort items inside each bucket by day
  for (const bucket of report.costs) {
    const key = Object.keys(bucket)[0];
    bucket[key].sort((a, b) => a.day - b.day);
  }

  // Save once for past months
  if (isPastMonth(_year, _month)) {
    try {
      await Report.create(report);
    } catch {
      // ignore duplicate writes
    }
  }

  return report;
}
