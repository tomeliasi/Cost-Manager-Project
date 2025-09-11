import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
  {
    description: {
        type: String,
        required: true // The description of the cost is mandatory
    },
    category: {
        type: String,
        required: true, // The category is required
        enum: ['food', 'health', 'housing', 'sport', 'education', 'fruit'],
        // The category must be one of the predefined values
    },
    userid: {
        type: String,
        required: true // The user ID associated with the cost is required
    },
    sum: {
        type: Number,
        required: true // The cost amount is mandatory
    },
    date: {
        type: Date,
        default: Date.now // If no date is provided, the current date is used by default
    },
  },
  { collection: "costs" }
);

export const Cost = mongoose.model("Cost", costSchema);
