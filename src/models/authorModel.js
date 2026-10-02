import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
 name: { type: String, required: [true, "Author name is required"] },
 nacionality: { type: String }
}, { versionKey: false});

const authorModel = mongoose.model("author", authorSchema);

export { authorModel, authorSchema };
