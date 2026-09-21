import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
 name: { type: String, required: true },
 nacionality: { type: String }
}, { versionKey: false});

const authorModel = mongoose.model("author", authorSchema);

export { authorModel, authorSchema };
