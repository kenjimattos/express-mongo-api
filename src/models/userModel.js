import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"]
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "{VALUE} isn't a valid email address",
      }
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      select: false,
    },
  },
  { versionKey: false },
);

usersSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // evita re-hash em updates
  this.password = await bcrypt.hash(this.password, 10);
});

const userModel = mongoose.model("users", usersSchema);

export default userModel;
