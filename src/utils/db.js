import mongoose from "mongoose";

/* Connect to MongoDB (Mongoose). Expects a full connection string. */
export async function connectToDB(mongoUri) {
  if (!mongoUri) {
    const err = new Error("MONGODB_URI is missing");
    err.status = 500;
    throw err;
  }

  /* safer query parsing */
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  return mongoose.connection;
}
