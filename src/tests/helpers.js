import { buildApp } from "../src/app.js";
import { connectToDB } from "../src/utils/db.js";
import mongoose from "mongoose";

export async function setupTestApp() {
  await connectToDB(process.env.MONGODB_URI_TEST || process.env.MONGODB_URI);
  return buildApp();
}

export async function disconnect() {
  await mongoose.disconnect();
}
