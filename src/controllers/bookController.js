import bookModel from "../models/bookModel.js";
import { authorModel } from "../models/authorModel.js";

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
  static async getBookById(req, res) {
    try {
      const id = req.params.id;
      const bookDoc = await bookModel.findById(id);
      res.status(200).json(bookDoc);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to find book` });
    }
  }
  static async createBook(req, res) {
    const newBook = req.body;
    try {
      const author = await authorModel.findById(newBook.author);
      const fullBook = { ...newBook, author: { ...author._doc } };
      const createdBook = await bookModel.create(fullBook);
      res.status(201).json({ message: "Book created successfully", book: createdBook });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to create book` });
    }
  }
  static async updateBook(req, res) {
    try {
      const id = req.params.id;
      await bookModel.findByIdAndUpdate(id, req.body);
      const updatedBook = await bookModel.findById(id);
      res.status(201).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to update book` });
    }
  }
  static async removeBook(req, res) {
    try {
      const id = req.params.id;
      const deletedBook = await bookModel.findByIdAndDelete(id);
      res.status(201).json({ message: "Book removed successfully", book: deletedBook });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to remove book` });
    }
  }
  
  static async queryBooksByPublisher(req, res) {
    const publisher = req.query.publisher;
    try {
      const booksByPublisher = await bookModel.find({ publisher: publisher });
      res.status(200).json(booksByPublisher);
    } catch (error) {
      res.status(500).json({ message: `${error.message} - failed to search books` });
    }
  }
};

export default BookController;