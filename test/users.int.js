import mongoose from "mongoose";
import connectDatabase from "../src/config/dbConnect.js";
import UsersService from "../src/services/usersService.js";
import BadRequestError from "../src/middlewares/errors/badRequestError.js";
import { describe, test, before, after } from "node:test";
import assert from "node:assert";

const usersService = new UsersService();

describe("Users Integration", () => {
  before(async () => {
    await connectDatabase();
  });

  after(async () => {
    await mongoose.connection.collection("users").deleteMany({ email: "johndoe@example.com" });
    await mongoose.disconnect();
  });

  test("create user with existing e-mail", async () => {
    await usersService.createUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    });

    await assert.rejects(
      usersService.createUser({
        name: "John Doe Jr.",
        email: "johndoe@example.com",
        password: "password123",
      }),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(
          error.message,
          "Can't create user: e-mail already registered",
        );
        return true;
      },
    );
  });

  test("update user password hashes the new password", async () => {
    const user = await mongoose.connection.collection("users").findOne({
      email: "johndoe@example.com",
    });
    assert.ok(user);
    
    const updated = await usersService.updateUser(user._id, {
      password: "newpassword456",
    });

    assert.notStrictEqual(updated.password, "newpassword456");
  });
});
