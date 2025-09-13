// server.js
import { buildApp } from "./app.js";
import { connectToDB } from "./utils/db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

let server;

(async () => {
  console.log("BOOT: starting server…");

  // נסה להתחבר ל-Mongo, אבל אל תפיל את האפליקציה אם זה נכשל
  try {
    console.log("DB: connecting…");
    await connectToDB(MONGODB_URI);
    console.log("DB: connected ✅");
  } catch (err) {
    console.error("DB: connection FAILED ❌", err?.message || err);
    // ממשיכים הלאה – ה-API יעלה ויחזיר 500 בנקודות שדורשות DB
  }

  const app = buildApp();

  // נקודת בריאות שתמיד זמינה
  app.get("/health", (_req, res) => res.status(200).send("OK"));

  server = app.listen(PORT, () => {
    console.log(`HTTP: listening on :${PORT}`);
  });
})().catch((e) => {
  console.error("FATAL boot error:", e);
  process.exit(1);
});

// ניטור שגיאות גלובליות
process.on("unhandledRejection", (e) => {
  console.error("unhandledRejection:", e);
});
process.on("uncaughtException", (e) => {
  console.error("uncaughtException:", e);
});

// סגירה אלגנטית (Render שולח SIGTERM בעת רידפלוי/כיבוי)
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully…");
  if (server) {
    server.close(() => {
      console.log("HTTP: closed. Bye.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
