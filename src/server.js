import { buildApp } from "./app.js";
import { connectToDB } from "./utils/db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  try {
    await connectToDB(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }

  const app = buildApp();

  app.get("/health", (req, res) => res.send("OK"));

  app.listen(PORT, () => console.log(`Server listening on :${PORT}`));
})();
