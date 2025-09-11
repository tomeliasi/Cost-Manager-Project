import { buildApp } from "./app.js";
import { connectToDB } from "./utils/db.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  await connectToDB(MONGODB_URI);
  const app = buildApp();
  app.listen(PORT, () => console.log(`listening on :${PORT}`));
})();
