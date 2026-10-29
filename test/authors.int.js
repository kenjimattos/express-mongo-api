import mongoose from "mongoose";
import connectDatabase from "../src/config/dbConnect.js";
import AuthorsService from "../src/services/authorsService.js";
import BadRequestError from "../src/middlewares/errors/badRequestError.js";
import { describe, test, before, after } from "node:test";
import assert from "node:assert";

const authorsService = new AuthorsService();

describe("Authors Integration", () => {
  before(async () => {
    await connectDatabase();
    await authorsService.createAuthor({
      name: "Steve Dikto",
      nationality: "American",
    });
  });

  after(async () => {
    await mongoose.connection
      .collection("authors")
      .deleteMany({ name: "Steve Dikto" });
    await mongoose.disconnect();
  });

  test("create author with existing name", async () => {
    await assert.rejects(
      authorsService.createAuthor({
        name: "Steve Dikto",
        nationality: "Canadian",
      }),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "AUTHOR_NAME_ALREADY_EXISTS");
        return true;
      },
    );
  });
});
