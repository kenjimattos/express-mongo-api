import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";
import { authorModel, bookModel } from "../src/models/index.js";

describe("Books Routes", () => {
  after(async () => {
    await mongoose.disconnect();
  });

  test("create a new book", async () => {
    const author = await authorModel.create({
      name: "Stan Lee",
      nationality: "United States of America"      
    });

    await request(app)
      .post("/books")
      .send({
        title: "Spider-man",
        author: `${author.id}`,
        publisher: "Marvel Comics",
        price: 100,
        pages: 100 
      })
      .expect(201)
      .expect((response) => {
        const book = response.body.book;

        assert.strictEqual(book.title, "Spider-man");
        assert.strictEqual(book.publisher, "Marvel Comics");
        assert.strictEqual(book.price, 100);
        assert.strictEqual(book.pages, 100);
      });
  });

  test("creating a book without an author", async () => {

    await request(app)
      .post("/books")
      .send({
        title: "Spider-man",
        author: "",
        publisher: "Marvel Comics",
        price: 100,
        pages: 100 
      })
      .expect(400)
      .expect((response) => {
        const errorCode = response.body.type;
        assert.strictEqual(errorCode, "VALIDATION_ERROR");
      });
  });

  test("creating a book with unexisting publisher", async () => {
    const author = await authorModel.create({
      name: "Mike Mignola",
      nationality: "United States of America"      
    });

    await request(app)
      .post("/books")
      .send({
        title: "Hellboy",
        author: `${author.id}`,
        publisher: "Dark Horse Comics",
        price: 100,
        pages: 100 
      })
      .expect(400)
      .expect((response) => {
        const errorCode = response.body.type;
        assert.strictEqual(errorCode, "VALIDATION_ERROR");
      });
    await authorModel.findByIdAndDelete(author.id);
  });

  test("get a book by id", async () => {
    const book = await bookModel.findOne({ title: "Spider-man" });
    const bookId = book.id;

    await request(app)
      .get(`/books/${bookId}`)
      .send({})
      .expect(200)
      .expect((response) => {
        const returnedBook = response.body;
        assert.strictEqual(returnedBook.title, "Spider-man");
      });
  });

  test("delete a book by id", async () => {
    const book = await bookModel.findOne({ title: "Spider-man" });
    const bookId = book.id;;

    await request(app)
      .delete(`/books/${bookId}`)
      .send({})
      .expect(201)
      .expect((response) => {
        assert.strictEqual(response.body.message, "Book removed successfully");
        assert.strictEqual(response.body.book.title, "Spider-man");
      });
    
    const authorId = book.author._id.toHexString();
    await authorModel.findByIdAndDelete(authorId);
  });

  test("get a book by id that does not exist", async () => {
    await request(app)
      .get("/books/abcabcabcabcabcabcabc123")
      .send()
      .expect(404)
      .expect((response) => {
        const errorCode = response.body.type;
        assert.strictEqual(errorCode, "NOT_FOUND");
      });
  });
});
