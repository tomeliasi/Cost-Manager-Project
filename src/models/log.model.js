import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    method: String, /* HTTP method (GET/POST/...) */
    path: String, /* request path (/api/users) */
    status: Number, /* response status code */
    duration_ms: Number, /* request duration in ms */
    at: { type: Date, default: () => new Date() }, /* when it happened */
  },
  { collection: "logs" }
);

// Reuse existing model
export const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
