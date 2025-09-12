import mongoose from "mongoose";

// Connect to MongoDB (Mongoose). Expects a full connection string.
export async function connectToDB(mongoUri) {
  if (!mongoUri) {
    const err = new Error("MONGODB_URI is missing");
    err.status = 500;
    throw err;
  }

  mongoose.set("strictQuery", true); // safer query parsing
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  return mongoose.connection;
}
