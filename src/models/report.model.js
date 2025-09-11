import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userid: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    costs: { type: Array, required: true },
    created_at: { type: Date, default: () => new Date() },
  },
  { collection: "reports" }
);

reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

export const Report =
  mongoose.models.Report || mongoose.model("Report", reportSchema);
