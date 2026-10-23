import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";
import { userModel } from "../src/models/index.js";

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

  test("creating a user with empty fields", async () => {
    await request(app)
      .post("/users")
      .send({
        name: "",
        email: "",
        password: "",
      })
      .expect(400)
      .expect((response) => {
        const errorCode = response.body.type;
        assert.strictEqual(errorCode, "VALIDATION_ERROR");
      });
  });

  test("get a user by id", async () => {
    const user = await userModel.findOne({ email: "johndoe@example.com" });
    const userId = user.id;
    await request(app)
      .get(`/users/${userId}`)
      .send({})
      .expect(200)
      .expect((response) => {
        const returnedUser = response.body;
        assert.strictEqual(returnedUser.name, "John Doe");
      });
  });

  test("delete a user by id", async () => {
    const user = await userModel.findOne({ email: "johndoe@example.com" });
    const userId = user.id;
    await request(app)
      .delete(`/users/${userId}`)
      .send({})
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.message, "User removed successfully");
        assert.strictEqual(response.body.user.name, "John Doe");
      });
  });

  test("get a user by id that does not exist", async () => {
    await request(app)
      .get("/users/abcabcabcabcabcabcabc123")
      .send()
      .expect(404)
      .expect((response) => {
        const errorCode = response.body.type;
        assert.strictEqual(errorCode, "NOT_FOUND");
      });
  });
});
