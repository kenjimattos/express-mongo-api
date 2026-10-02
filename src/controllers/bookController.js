import bookModel from "../models/bookModel.js";
import { authorModel } from "../models/authorModel.js";
import NotFoundError from "../middlewares/errors/notFoundError.js";

class BookController {
  static async getBooks(req, res) {
    try {
      const booksList = await bookModel.find({});
      res.status(200).json(booksList);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to list books` });
    }
  }

  static async getBookById(req, res, next) {
    try {
      const id = req.params.id;
      const bookDoc = await bookModel.findById(id);

      if (bookDoc !== null) {
        res.status(200).json(bookDoc);
      } else {
        next(new NotFoundError("Could not find book. Book ID not found"));
      }

    } catch (error) {
      next(error);
    }
  }

  static async createBook(req, res, next) {
    const newBook = req.body;
    try {
      const author = await authorModel.findById(newBook.author);
      const fullBook = { ...newBook, author: { ...author._doc } };
      const createdBook = await bookModel.create(fullBook);

      res.status(201).json({ message: "Book created successfully", book: createdBook });
    } catch (error) {
      next(error);
    }
  }

  static async updateBook(req, res, next) {
    try {
      const id = req.params.id;
      await bookModel.findByIdAndUpdate(id, req.body);
      const updatedBook = await bookModel.findById(id);

      if (updatedBook !== null) {
        res.status(201).json({ message: "Book updated successfully", book: updatedBook });
      } else {
        next(new NotFoundError("Could not update book. Book ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async removeBook(req, res, next) {
    try {
      const id = req.params.id;
      const deletedBook = await bookModel.findByIdAndDelete(id);

      if (deletedBook !== null) {
        res.status(201).json({ message: "Book removed successfully", book: deletedBook });
      } else {
        next(new NotFoundError("Could not remove book. Book ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async queryBooksByPublisher(req, res, next) {
    const publisher = req.query.publisher;
    try {
      const booksByPublisher = await bookModel.find({ publisher: publisher });
      res.status(200).json(booksByPublisher);
    } catch (error) {
      next(error);
    }
  }
};

export default BookController;