import { buildApp } from "./app.js";
import { connectToDB } from "./utils/db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

let server;

(async () => {
  console.log("[BOOT] Starting server...");

  // Try to connect to MongoDB, but don't crash if it fails
  try {
    console.log("[DB] Attempting to connect...");
    await connectToDB(MONGODB_URI);
    console.log("[DB] Connected successfully");
  } catch (err) {
    // Continue running so /health and non-DB routes are still available
    console.error("[DB] Connection failed:", err?.message || err);
  }

  const app = buildApp();

  // Health check endpoint (always available)
  app.get("/health", (_req, res) => res.status(200).send("OK"));

  server = app.listen(PORT, () => {
    console.log(`[HTTP] Server is listening on port ${PORT}`);
  });
})().catch((e) => {
  console.error("[BOOT] Fatal startup error:", e);
  process.exit(1);
});

// Global error monitoring
process.on("unhandledRejection", (e) => {
  console.error("[PROC] Unhandled Promise Rejection:", e);
});
process.on("uncaughtException", (e) => {
  console.error("[PROC] Uncaught Exception:", e);
});

// Graceful shutdown (Render sends SIGTERM on redeploy/stop)
process.on("SIGTERM", () => {
  console.log("[PROC] SIGTERM received, shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("[HTTP] Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
