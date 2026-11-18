import { describe, test } from "node:test";
import assert from "node:assert";
import BooksController from "../../src/controllers/booksController.js";
import NotFoundError from "../../src/middlewares/errors/notFoundError.js";

describe("Books Controller", () => {
  test("book not found", async () => {
    const service = { getBookById: async () => null };
    const controller = new BooksController(service);

    const req = { params: { id: "123" } };
    const res = {};

    let receivedError;
    const next = (error) => {
      receivedError = error;
    };

    await controller.getBookById(req, res, next);

    assert.ok(receivedError instanceof NotFoundError);
  });
});
