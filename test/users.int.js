import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDatabase from "../src/config/dbConnect.js";
import UsersService from "../src/services/usersService.js";
import { userModel } from "../src/models/index.js";
import BadRequestError from "../src/middlewares/errors/badRequestError.js";
import { describe, test, before, after } from "node:test";
import assert from "node:assert";

const usersService = new UsersService();

describe("Users Integration", () => {
  let user;

  before(async () => {
    await connectDatabase();

    user = await usersService.createUser({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "password123",
    });
  });

  after(async () => {
    await mongoose.connection
      .collection("users")
      .deleteMany({ email: "johndoe@example.com" });
    await mongoose.disconnect();
  });

  test("create user with existing e-mail", async () => {
    await assert.rejects(
      usersService.createUser({
        name: "John Doe Jr.",
        email: "johndoe@example.com",
        password: "password123",
      }),
      (error) => {
        assert.ok(error instanceof BadRequestError);
        assert.strictEqual(error.status, 400);
        assert.strictEqual(
          error.type,
          "EMAIL_ALREADY_REGISTERED",
        );
        return true;
      },
    );
  });

  test("update user password hashes the new password", async () => {
    await usersService.updateUser(user._id, { password: "newpassword456" });

    const stored = await userModel.findById(user._id).select("+password");

    assert.notStrictEqual(stored.password, "newpassword456");
    assert.ok(await bcrypt.compare("newpassword456", stored.password));
  });
});
