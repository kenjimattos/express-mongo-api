import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";

describe("Users Routes", () => {
  const createdIds = [];

  async function createUser(data) {
    const response = await request(app).post("/users").send(data);
    const user = response.body.user;
    if (user) createdIds.push(user._id);
    return { response, user };
  }

  after(async () => {
    for (const id of createdIds) {
      await request(app).delete(`/users/${id}`);
    }
    await mongoose.disconnect();
  });

  test("create a new user", async () => {
    const { response, user } = await createUser({
      name: "John Doe",
      email: "johndoe.e2e@example.com",
      password: "password123",
    });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(user.name, "John Doe");
    assert.strictEqual(user.email, "johndoe.e2e@example.com");
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
        assert.strictEqual(response.body.type, "VALIDATION_ERROR");
      });
  });

  test("get a user by id", async () => {
    const { user } = await createUser({
      name: "Jane Doe",
      email: "janedoe.e2e@example.com",
      password: "password123",
    });

    await request(app)
      .get(`/users/${user._id}`)
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.name, "Jane Doe");
      });
  });

  test("delete a user by id", async () => {
    const { user } = await createUser({
      name: "Jim Doe",
      email: "jimdoe.e2e@example.com",
      password: "password123",
    });

    await request(app)
      .delete(`/users/${user._id}`)
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.user.name, "Jim Doe");
      });

    await request(app).get(`/users/${user._id}`).expect(404);
  });

  test("get a user by id that does not exist", async () => {
    await request(app)
      .get("/users/abcabcabcabcabcabcabc123")
      .expect(404)
      .expect((response) => {
        assert.strictEqual(response.body.type, "NOT_FOUND");
      });
  });
});
