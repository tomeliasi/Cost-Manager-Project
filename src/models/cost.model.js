import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
    description: { type: String, required: true }, /* what was bought */
    category: {
      type: String,
      required: true,
      enum: ["food", "health", "housing", "sports", "education"], /* fixed list */
    },
    userid: { type: Number, required: true }, /* user ID (number) */
    sum: { type: Number, required: true }, /* amount */
    date: { type: Date, default: Date.now }, /* when it happened */
  },
  { collection: "costs" }
);

export const Cost = mongoose.model("Cost", costSchema);
