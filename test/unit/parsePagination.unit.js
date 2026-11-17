import parsePagination from "../../src/utils/parsePagination.js";
import { describe, test } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import BadRequestError from "../../src/middlewares/errors/badRequestError.js";

describe("Pagination function", () => {
  const schema = new mongoose.Schema(
    {
      title: String,
      price: Number,
      secret: { type: String, select: false },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
  );

  test("default parameters", () => {
    const query = {};

    const { limit, page, sort } = parsePagination(query, schema);

    assert.strictEqual(limit, 5);
    assert.strictEqual(page, 1);
    assert.deepStrictEqual(sort, { _id: "desc" });
  });

  test("valid parameters", () => {
    const query = {
      limit: "10",
      page: "2",
      sortBy: "price",
      order: "asc",
    };

    const { limit, page, sort } = parsePagination(query, schema);

    assert.strictEqual(limit, 10);
    assert.strictEqual(page, 2);
    assert.deepStrictEqual(sort, { price: "asc" });
  });

  describe("limit", () => {
    test("invalid inputs fall back to the default", () => {
      const values = ["0", "abc"];

      for (const value of values) {
        const query = {
          limit: value,
        };

        const { limit } = parsePagination(query, schema);

        assert.strictEqual(limit, 5);
      }
    });

    test("negative inputs clamped to 1", () => {
      const values = ["-5", "-1"];

      for (const value of values) {
        const query = {
          limit: value,
        };

        const { limit } = parsePagination(query, schema);

        assert.strictEqual(limit, 1);
      }
    });

    test("abuse capped at 100", () => {
      const query = {
        limit: "1000",
      };

      const { limit } = parsePagination(query, schema);

      assert.strictEqual(limit, 100);
    });
  });

  describe("page", () => {
    test("inputs clamped to 1", () => {
      const values = ["0", "-5"];

      for (const value of values) {
        const query = {
          page: value,
        };

        assert.strictEqual(parsePagination(query, schema).page, 1);
      }
    });
  });

  describe("order", () => {
    test("asc", () => {
      const query = {
        order: "asc",
      };

      const { sort } = parsePagination(query, schema);

      assert.deepStrictEqual(sort, { _id: "asc" });
    });

    test("invalid input", () => {
      const query = {
        order: "banana",
      };

      assert.throws(
        () => parsePagination(query, schema),
        (error) => {
          assert.ok(error instanceof BadRequestError);
          assert.strictEqual(error.status, 400);
          assert.strictEqual(error.type, "BAD_REQUEST");
          return true;
        },
      );
    });
  });

  describe("sortBy", () => {
    test("timestamp field", () => {
      const query = {
        sortBy: "created_at",
      };

      const { sort } = parsePagination(query, schema);

      assert.deepStrictEqual(sort, { created_at: "desc" });
    });

    test("unexisting field", () => {
      const query = {
        sortBy: "unexisting",
      };

      assert.throws(
        () => parsePagination(query, schema),
        (error) => {
          assert.ok(error instanceof BadRequestError);
          assert.strictEqual(error.status, 400);
          assert.strictEqual(error.type, "BAD_REQUEST");
          return true;
        },
      );
    });

    test("hidden field", () => {
      const query = {
        sortBy: "secret",
      };

      assert.throws(
        () => parsePagination(query, schema),
        (error) => {
          assert.ok(error instanceof BadRequestError);
          assert.strictEqual(error.status, 400);
          assert.strictEqual(error.type, "BAD_REQUEST");
          return true;
        },
      );
    });
  });
});
