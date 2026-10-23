import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";
import { authorModel } from "../src/models/index.js";

describe("Authors Routes", () => {
  after(async () => {
    await mongoose.disconnect();
  });

  test("create a new author", async () => {
    await request(app)
      .post("/authors")
      .send({
        name: "John Doe",
        nacionality: "Brazilian"
      })
      .expect(201)
      .expect((response) => {
        const author = response.body.author;
        assert.strictEqual(author.name, "John Doe");
        assert.strictEqual(author.nacionality, "Brazilian");
      });
  });

  test("creating an author with empty fields", async () => {
    await request(app)
      .post("/authors")
      .send({
        name: "",
        nacionality: ""
      })
      .expect(400)
      .expect((response) => {
        const errorCode = response.body.type;
        assert.strictEqual(errorCode, "VALIDATION_ERROR");
      });
  });

  test("get an author by id", async () => {
    const author = await authorModel.findOne({ name: "John Doe" });
    const authorId = author.id;
    await request(app)
      .get(`/authors/${authorId}`)
      .send({})
      .expect(200)
      .expect((response) => {
        const returnedAuthor = response.body;
        assert.strictEqual(returnedAuthor.name, "John Doe");
      });
  });

  test("delete an author by id", async () => {
    const author = await authorModel.findOne({ name: "John Doe" });
    const authorId = author.id;
    await request(app)
      .delete(`/authors/${authorId}`)
      .send({})
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.message, "Author removed successfully");
        assert.strictEqual(response.body.author.name, "John Doe");
      });
  });

  test("get an author by id that does not exist", async () => {
    await request(app)
      .get("/authors/abcabcabcabcabcabcabc123")
      .send()
      .expect(404)
      .expect((response) => {
        const errorCode = response.body.type;
        assert.strictEqual(errorCode, "NOT_FOUND");
      });
  });
});
