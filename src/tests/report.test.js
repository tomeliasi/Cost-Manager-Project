import request from "supertest";
import { setupTestApp, disconnect } from "./helpers.js";

let app;
beforeAll(async () => {
  app = await setupTestApp();
});
afterAll(async () => {
  await disconnect();
});

test("GET /api/report returns report skeleton with categories", async () => {
  const now = new Date();
  const res = await request(app).get(
    `/api/report?id=123123&year=${now.getFullYear()}&month=${
      now.getMonth() + 1
    }`
  );
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("userid");
  expect(Array.isArray(res.body.costs)).toBe(true);
});
