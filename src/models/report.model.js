import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userid: { type: Number, required: true }, /* user ID */
    year: { type: Number, required: true }, /* report year */
    month: { type: Number, required: true }, /* report month (1-12) */
    costs: { type: Array, required: true }, /* [{ food:[... ] }, { education:[... ] }, ...] */
    created_at: { type: Date, default: () => new Date() }, /* cache timestamp */
  },
  { collection: "reports" }
);

/* one report per user+year+month */
reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

/* reuse existing model if already compiled */
export const Report =
  mongoose.models.Report || mongoose.model("Report", reportSchema);
