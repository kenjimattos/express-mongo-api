import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }
}, { versionKey: false });

usersSchema.pre("save", async function () {
  if (!this.isModified("password")) return;   // evita re-hash em updates
  this.password = await bcrypt.hash(this.password, 10);
});

const userModel = mongoose.model("users", usersSchema);

export default userModel;
