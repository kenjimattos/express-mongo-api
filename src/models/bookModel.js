import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "author",
      required: [true, "Book author is required"],
    },
    publisher: {
      type: String,
      required: [true, "Book publisher is required"],
      enum: {
        values: ["HarperCollins", "DC Comics", "Marvel Comics"],
        message: "{VALUE} isn't a valid publisher name",
      },
    },
    price: {
      type: Number,
      required: [true, "Book price is required"],
      validate: {
        validator: (value) => {
          return value > 0;
        },
        message: "{VALUE} isn't a valid price. Book price must be greater than 0",
      },
    },
    pages: {
      type: Number,
      validate: {
        validator: (value) => {
          return value >= 1 && value <= 5000;
        },
        message: "{VALUE} isn't a valid page number. Book pages must be at least 1 and at most 5000",
      }
    },
  },
  { versionKey: false },
);

const bookModel = mongoose.model("book", bookSchema);

export default bookModel;
