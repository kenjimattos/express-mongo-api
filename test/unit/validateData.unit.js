import { validateData } from "../../src/services/salesService.js";
import { describe, test } from "node:test";
import assert from "node:assert";
import BadRequestError from "../../src/middlewares/errors/badRequestError.js";

describe("Validate sales payloads", () => {
  test("valid data", () => {
    const payload = {
      user: "abcabcabcabcabcabcabc123",
      items: [
        {
          book: "abcabcabcabcabcabcabc123",
          quantity: 1,
        },
      ],
      payment_type: "credit",
    };
    assert.doesNotThrow(() => validateData(payload));
  });

  test("invalid data", () => {
    const payload = ["a", "b", "c"];

    assert.throws(
      () => validateData(payload),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "INVALID_DATA");
        return true;
      },
    );

    assert.throws(
      () => validateData(null),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "INVALID_DATA");
        return true;
      },
    );
  });

  test("invalid items: no book", () => {
    const payload = {
      user: "abcabcabcabcabcabcabc123",
      items: [
        {
          quantity: 1,
        },
      ],
      payment_type: "credit",
    };

    assert.throws(
      () => validateData(payload),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "INVALID_ITEMS");
        return true;
      },
    );
  });

  test("invalid items: not an array", () => {
    const payload = {
      user: "abcabcabcabcabcabcabc123",
      items: {
        book: "abcabcabcabcabcabcabc123",
        quantity: 1,
      },
      payment_type: "credit",
    };

    assert.throws(
      () => validateData(payload),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(error.type, "INVALID_ITEMS");
        return true;
      },
    );
  });

  test("invalid quantity", () => {
    const payloads = [
      { book: "abcabcabcabcabcabcabc123", quantity: 0 },
      { book: "abcabcabcabcabcabcabc123", quantity: -1 },
      { book: "abcabcabcabcabcabcabc123", quantity: 1.5 },
      { book: "abcabcabcabcabcabcabc123", quantity: "2" },
      { book: "abcabcabcabcabcabcabc123", quantity: true },
    ];

    for (const item of payloads) {
      const payload = {
        user: "abcabcabcabcabcabcabc123",
        items: [item],
        payment_type: "credit",
      };

      assert.throws(
        () => validateData(payload),
        (error) => {
          assert.ok(error instanceof BadRequestError);
          assert.strictEqual(error.status, 400);
          assert.strictEqual(error.type, "INVALID_QUANTITY");
          return true;
        },
      );
    }
  });
});
