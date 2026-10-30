import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";

describe("Books Routes", () => {
  const createdAuthorIds = [];
  const createdBookIds = [];

  async function createAuthor(data) {
    const response = await request(app).post("/authors").send(data);
    const author = response.body.author;
    if (author) createdAuthorIds.push(author._id);
    return author;
  }

  async function createBook(data) {
    const response = await request(app).post("/books").send(data);
    const book = response.body.book;
    if (book) createdBookIds.push(book._id);
    return { response, book };
  }

  after(async () => {
    for (const id of createdBookIds) {
      await request(app).delete(`/books/${id}`);
    }
    for (const id of createdAuthorIds) {
      await request(app).delete(`/authors/${id}`);
    }
    await mongoose.disconnect();
  });

  test("create a new book", async () => {
    const author = await createAuthor({
      name: "Stan Lee",
      nationality: "United States of America",
    });

    const { response, book } = await createBook({
      title: "Spider-man",
      author: author._id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    assert.strictEqual(response.status, 201);
    assert.strictEqual(book.title, "Spider-man");
    assert.strictEqual(book.publisher, "Marvel Comics");
    assert.strictEqual(book.price, 100);
    assert.strictEqual(book.pages, 100);
  });

  test("creating a book without an author", async () => {
    await request(app)
      .post("/books")
      .send({
        title: "Spider-man",
        author: "",
        publisher: "Marvel Comics",
        price: 100,
        pages: 100,
      })
      .expect(400)
      .expect((response) => {
        assert.strictEqual(response.body.type, "VALIDATION_ERROR");
      });
  });

  test("creating a book with unexisting publisher", async () => {
    const author = await createAuthor({
      name: "Mike Mignola",
      nationality: "United States of America",
    });

    await request(app)
      .post("/books")
      .send({
        title: "Hellboy",
        author: author._id,
        publisher: "Dark Horse Comics",
        price: 100,
        pages: 100,
      })
      .expect(400)
      .expect((response) => {
        assert.strictEqual(response.body.type, "VALIDATION_ERROR");
      });
  });

  test("get a book by id", async () => {
    const author = await createAuthor({
      name: "Steve Ditko",
      nationality: "United States of America",
    });
    const { book } = await createBook({
      title: "Doctor Strange",
      author: author._id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    await request(app)
      .get(`/books/${book._id}`)
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.title, "Doctor Strange");
      });
  });

  test("delete a book by id", async () => {
    const author = await createAuthor({
      name: "Jack Kirby",
      nationality: "United States of America",
    });
    const { book } = await createBook({
      title: "Fantastic Four",
      author: author._id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    await request(app)
      .delete(`/books/${book._id}`)
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.book.title, "Fantastic Four");
      });

    await request(app).get(`/books/${book._id}`).expect(404);
  });

  test("get a book by id that does not exist", async () => {
    await request(app)
      .get("/books/abcabcabcabcabcabcabc123")
      .expect(404)
      .expect((response) => {
        assert.strictEqual(response.body.type, "NOT_FOUND");
      });
  });
});
