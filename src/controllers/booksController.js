import NotFoundError from "../middlewares/errors/notFoundError.js";

class BooksController {
  constructor(booksService) {
    this.booksService = booksService;
  }

  getBooks(req, res, next) {
    try {
      const booksList = this.booksService.getBooks();

      req.result = booksList;
      next();
    } catch (error) {
      next(error);
    }
  }

  async getBookById(req, res, next) {
    try {
      const id = req.params.id;
      const bookDoc = await this.booksService.getBookById(id);

      if (bookDoc !== null) {
        res.status(200).json(bookDoc);
      } else {
        next(new NotFoundError("Could not find book. Book ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  async createBook(req, res, next) {
    try {
      const createdBook = await this.booksService.createBook(req.body);

      res
        .status(201)
        .json({ message: "Book created successfully", book: createdBook });
    } catch (error) {
      next(error);
    }
  }

  async updateBook(req, res, next) {
    try {
      const updatedBook = await this.booksService.updateBook(req);

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

  async removeBook(req, res, next) {
    try {
      const id = req.params.id;
      const deletedBook = await this.booksService.removeBook(id);

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

  async queryBooks(req, res, next) {
    try {
      const processedQuery = await this.booksService.processQuery(req.query);

      req.result = this.booksService.queryBooks(processedQuery);
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default BooksController;
