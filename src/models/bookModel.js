import mongoose from "mongoose";
import { authorSchema } from "./authorModel.js";

const booksSchema = new mongoose.Schema({
 title: { type: String, required: true },
 publisher: { type: String },
 price: { type: Number },
 pages: { type: Number },
 author: { type: authorSchema, required: true }
}, { versionKey: false});

const bookModel = mongoose.model("books", booksSchema);

export default bookModel;
