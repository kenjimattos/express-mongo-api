import { describe, test, after } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import assert from "node:assert";
import CreateHelper from "./helpers/createHelper.js";

const create = new CreateHelper(app);

describe("Books Routes", () => {
  after(async () => {
    await create.cleanup();
    await mongoose.disconnect();
  });

  test("create a new book", async () => {
    const { author } = await create.author({
      name: "Stan Lee",
      nationality: "United States of America",
    });

    const { response, book } = await create.book({
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
    const { author } = await create.author({
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
    const { author } = await create.author({
      name: "Steve Ditko",
      nationality: "United States of America",
    });
    const { book } = await create.book({
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
    const { author } = await create.author({
      name: "Jack Kirby",
      nationality: "United States of America",
    });
    const { book } = await create.book({
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

describe("Books query", () => {
  after(async () => {
    await create.cleanup();
    await mongoose.disconnect();
  });
  
  test("query books by title", async () => {
    const { author } = await create.author({
      name: "Stan Lee",
      nationality: "United States of America",
    });

    await create.book({
      title: "Spider-man",
      author: author._id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    await create.book({
      title: "Iron Man",
      author: author._id,
      publisher: "Marvel Comics",
      price: 120,
      pages: 80,
    });

    await request(app)
      .get("/books/query?title=Iron Man")
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body[0].title, "Iron Man");
      });
  });

  test("query books by unexisting title", async () => {
    await request(app)
      .get("/books/query?title=Unknown Title")
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.length, 0);
      });
  });
  
  test("query books by author", async () => {
    const { author: author1 } = await create.author({
      name: "Jonathan Hickman",
      nationality: "United States of America",
    });
    
    const { author: author2 } = await create.author({
      name: "Greg Capullo",
      nationality: "United States of America",
    });

    await create.book({
      title: "Hulk",
      author: author1._id,
      publisher: "Marvel Comics",
      price: 100,
      pages: 100,
    });

    await create.book({
      title: "Wolverine",
      author: author1._id,
      publisher: "Marvel Comics",
      price: 120,
      pages: 80,
    });

    await create.book({
      title: "Thor: Ragnarok",
      author: author2._id,
      publisher: "Marvel Comics",
      price: 90,
      pages: 96,
    });

    await request(app)
      .get(`/books/query?authorName=${author1.name}`)
      .expect(200)
      .expect((response) => {
        const reqTitles = ["Hulk", "Wolverine"];
        const resTitles = response.body.map((book) => book.title);

        assert.strictEqual(resTitles.length, reqTitles.length);
        assert.deepStrictEqual(resTitles.sort(), reqTitles.sort());
      });
  });

  test("query books by unexisting author", async () => {
    await request(app)
      .get("/books/query?authorName=Unknown Author")
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.length, 0);
      });
  });
  
  test("query books by publisher", async () => {
    const { author } = await create.author({
      name: "Frank Miller",
      nationality: "United States of America",
    });

    await create.book({
      title: "Batman: Year One",
      author: author._id,
      publisher: "DC Comics",
      price: 100,
      pages: 100,
    });
    
    await create.book({
      title: "Dark Knight",
      author: author._id,
      publisher: "DC Comics",
      price: 120,
      pages: 80,
    });

    await request(app)
      .get("/books/query?publisher=DC Comics")
      .expect(200)
      .expect((response) => {
        const reqTitles = ["Batman: Year One", "Dark Knight"];
        const resTitles = response.body.map((book) => book.title);

        assert.strictEqual(resTitles.length, reqTitles.length);
        assert.deepStrictEqual(resTitles.sort(), reqTitles.sort());
        
      });
  });

  test("query books by unexisting publisher", async () => {
    await request(app)
      .get("/books/query?publisher=Unknown Publisher")
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.length, 0);
      });
  });

  test("query books by unexisting parameter", async () => {
    await request(app)
      .get("/books/query?unknownParam=value")
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.length, 0);
      });
  });

  test("query books by price", async () => {
    const { author } = await create.author({
      name: "John Romita Jr",
      nationality: "United States of America",
    });

    await create.book({
      title: "Superman",
      author: author._id,
      publisher: "DC Comics",
      price: 50,
      pages: 200,
    });

    await create.book({
      title: "Dare Devil",
      author: author._id,
      publisher: "Marvel Comics",
      price: 90,
      pages: 160,
    });

    await create.book({
      title: "Avengers",
      author: author._id,
      publisher: "Marvel Comics",
      price: 150,
      pages: 480,
    });

    await request(app)
      .get("/books/query?authorName=John Romita Jr&minPrice=90&maxPrice=140")
      .expect(200)
      .expect((response) => {
        assert.strictEqual(response.body.length, 1);
        assert.strictEqual(response.body[0].title, "Dare Devil");
      });
  });

});