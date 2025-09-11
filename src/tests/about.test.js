import request from "supertest";
import { setupTestApp, disconnect } from "./helpers.js";

let app;
beforeAll(async () => {
  app = await setupTestApp();
});
afterAll(async () => {
  await disconnect();
});

test("GET /api/about returns team", async () => {
  const res = await request(app).get("/api/about");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body[0]).toHaveProperty("first_name");
  expect(res.body[0]).toHaveProperty("last_name");
});
