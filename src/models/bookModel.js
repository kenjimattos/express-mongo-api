import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Book title is required"] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "author", required: [true, "Book author is required"] },
  publisher: { type: String, required: [true, "Book publisher is required"] },
  price: { type: Number, required: [true, "Book price is required"] },
  pages: { type: Number },
}, { versionKey: false });

const bookModel = mongoose.model("books", booksSchema);

export default bookModel;
