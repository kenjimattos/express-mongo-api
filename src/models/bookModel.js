import mongoose from "mongoose";
import { authorSchema } from "./authorModel.js";

const booksSchema = new mongoose.Schema({
 title: { type: String, required: [true, "Book title is required"] },
 publisher: { type: String, required: [true, "Book publisher is required"] },
 price: { type: Number, required: [true, "Book price is required"] },
 pages: { type: Number },
 author: { type: authorSchema, required: true }
}, { versionKey: false});

const bookModel = mongoose.model("books", booksSchema);

export default bookModel;
