import request from "supertest";
import { setupTestApp, disconnect } from "./helpers.js";

let app;
beforeAll(async () => {
  app = await setupTestApp();
});
afterAll(async () => {
  await disconnect();
});

test("POST /api/add adds cost (future/current month only)", async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // current month
  const res = await request(app)
    .post("/api/add")
    .send({
      userid: 123123,
      description: "milk 9",
      category: "food",
      sum: 8,
      day: Math.min(28, now.getDate()),
      year,
      month,
    });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("description", "milk 9");
});
