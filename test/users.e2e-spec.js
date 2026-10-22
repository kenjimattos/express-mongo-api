import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";

describe("Users Routes", () => {
  after(async () => {
    await mongoose.disconnect();
  });

  test("create a new user", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
      })
      .expect(201)
      .expect((response) => {
        const user = response.body.user;
        assert.strictEqual(user.name, "John Doe");
        assert.strictEqual(user.email, "johndoe@example.com");
      });
  });
});
