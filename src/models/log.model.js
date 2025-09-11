import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    method: String,
    path: String,
    status: Number,
    duration_ms: Number,
    at: { type: Date, default: () => new Date() },
  },
  { collection: "logs" }
);

export const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
