import request from "supertest";
import { setupTestApp, disconnect } from "./helpers.js";

let app;
beforeAll(async () => {
  app = await setupTestApp();
});
afterAll(async () => {
  await disconnect();
});

test("GET /api/users returns array", async () => {
  const res = await request(app).get("/api/users");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
