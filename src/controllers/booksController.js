import BooksService from "../services/booksService.js";
import NotFoundError from "../middlewares/errors/notFoundError.js";

const booksService = new BooksService();

class BooksController {
  static getBooks(req, res, next) {
    try {
      const booksList = booksService.getBooks();

      req.result = booksList;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async getBookById(req, res, next) {
    try {
      const id = req.params.id;
      const bookDoc = await booksService.getBookById(id);

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
    try {
      const createdBook = await booksService.createBook(req.body);

      res
        .status(201)
        .json({ message: "Book created successfully", book: createdBook });
    } catch (error) {
      next(error);
    }
  }

  static async updateBook(req, res, next) {
    try {
      const updatedBook = await booksService.updateBook(req);

      if (updatedBook !== null) {
        res
          .status(201)
          .json({ message: "Book updated successfully", book: updatedBook });
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
      const deletedBook = await booksService.removeBook(id);

      if (deletedBook !== null) {
        res
          .status(201)
          .json({ message: "Book removed successfully", book: deletedBook });
      } else {
        next(new NotFoundError("Could not remove book. Book ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async queryBooks(req, res, next) {
    try {
      const queriedBooks = booksService.queryBooks(req);

      req.result = queriedBooks;
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default BooksController;
