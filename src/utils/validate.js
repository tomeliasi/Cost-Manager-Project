export const CATEGORIES = ["food", "health", "housing", "sports", "education"];

export function assert(cond, msg, status = 400) {
  if (!cond) {
    const e = new Error(msg);
    e.status = status;
    throw e;
  }
}

export function isPastMonth(year, month) {
  const now = new Date();
  const curYM = now.getFullYear() * 100 + (now.getMonth() + 1);
  const qYM = Number(year) * 100 + Number(month);
  return qYM < curYM;
}
