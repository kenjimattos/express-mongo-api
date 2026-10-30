import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";

describe("Authors Routes", () => {
  const createdIds = [];

  async function createAuthor(data) {
    const response = await request(app).post("/authors").send(data);
    const author = response.body.author;
    if (author) createdIds.push(author._id);
    return { response, author };
  }

  after(async () => {
    for (const id of createdIds) {
      await request(app).delete(`/authors/${id}`);
    }
    await mongoose.disconnect();
  });

  test("create a new author", async () => {
    const { response, author } = await createAuthor({
      name: "John Doe",
      nationality: "Brazilian",
    });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(author.name, "John Doe");
    assert.strictEqual(author.nationality, "Brazilian");
  });

  test("creating an author with empty fields", async () => {
    await request(app)
      .post("/authors")
      .send({
        name: "",
        nationality: ""
      })
      .expect(400)
      .expect((response) => {
        assert.strictEqual(response.body.type, "VALIDATION_ERROR");
      });
  });

  test("get an author by id", async () => {
    const { author } = await createAuthor({
      name: "Jane Doe",
      nationality: "Brazilian",
    });

    await request(app)
      .get(`/authors/${author._id}`)
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.name, "Jane Doe");
      });
  });

  test("delete an author by id", async () => {
    const { author } = await createAuthor({
      name: "Jim Doe",
      nationality: "Brazilian",
    });

    await request(app)
      .delete(`/authors/${author._id}`)
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.author.name, "Jim Doe");
      });

    await request(app).get(`/authors/${author._id}`).expect(404);
  });

  test("get an author by id that does not exist", async () => {
    await request(app)
      .get("/authors/abcabcabcabcabcabcabc123")
      .expect(404)
      .expect((response) => {
        assert.strictEqual(response.body.type, "NOT_FOUND");
      });
  });
});
