// Allowed categories (must match the spec)
export const CATEGORIES = ["food", "health", "housing", "sports", "education"];

/* Tiny assert: throws with status if condition is false */
export function assert(condition, message, status = 400) {
  if (!condition) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }
}

/* True if (year, month) is before the current month (UTC) */
export function isPastMonth(year, month) {
  const _year = Number(year);
  const _month = Number(month);

  /* Compare as YYYYMM */
  const now = new Date();
  const currentYearMonth = now.getUTCFullYear() * 100 + (now.getUTCMonth() + 1);
  const targetYearMonth = _year * 100 + _month;

  return targetYearMonth < currentYearMonth;
}
