import { round } from "../../src/services/salesService.js";
import { describe, test } from "node:test";
import assert from "node:assert";

describe("Round float values to 2 decimal places", () => {
  test("rounds a float with more than 2 decimals", () => {
    assert.strictEqual(round(3.14159), 3.14);
    assert.strictEqual(round(2.71828), 2.72);
    assert.strictEqual(round(1.005), 1);
  });
});
