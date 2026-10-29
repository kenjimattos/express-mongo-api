import mongoose from "mongoose";
import connectDatabase from "../src/config/dbConnect.js";
import BooksService from "../src/services/booksService.js";
import BadRequestError from "../src/middlewares/errors/badRequestError.js";
import { describe, test, before, after } from "node:test";
import assert from "node:assert";

const booksService = new BooksService();

describe("Books Integration", () => {
  before(async () => {
    await connectDatabase();
  });

  after(async () => {
    await mongoose.disconnect();
  });

  test("create book with unexisting author", async () => {
    await assert.rejects(
      booksService.createBook({
        title: "Spider-man",
        author: new mongoose.Types.ObjectId(),
        publisher: "Marvel Comics",
        price: 100,
        pages: 100,
      }),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "UNEXISTING_AUTHOR");
        return true;
      },
    );
  });
});
