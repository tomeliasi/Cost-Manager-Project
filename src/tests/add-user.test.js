import request from "supertest";
import { setupTestApp, disconnect } from "./helpers.js";

let app;
beforeAll(async () => {
  app = await setupTestApp();
});
afterAll(async () => {
  await disconnect();
});

test("POST /api/add adds user", async () => {
  const res = await request(app).post("/api/add").send({
    id: 123123,
    first_name: "mosh",
    last_name: "israeli",
    birthday: "1990-01-01",
  });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id", 123123);
});
