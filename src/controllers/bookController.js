import { authorModel, bookModel } from "../models/index.js";
import NotFoundError from "../middlewares/errors/notFoundError.js";
import BadRequestError from "../middlewares/errors/badRequestError.js";

class BookController {
  static async getBooks(req, res, next) {
    try {
      let { limit, page, orderBy = "title:1" } = req.query;

      limit = limit ? parseInt(limit) : 5;
      page = page ? parseInt(page) : 1;

      let [field, order] = orderBy.split(":");

      field = field ? field : "title";
      order = order ? parseInt(order) : 1;

      if (limit > 0 && page > 0) {
        const booksList = await bookModel.find()
          .sort({ [field]: order })
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("author")
          .exec();
  
        res.status(200).json(booksList);
      } else {
        next(new BadRequestError("Limit and page must be greater than 0"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async getBookById(req, res, next) {
    try {
      const id = req.params.id;
      const bookDoc = await bookModel.findById(id)
        .populate("author", "name")
        .exec();

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
      let newBook = new bookModel(req.body);
      const createdBook = await newBook.save();

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

  static async queryBooks(req, res, next) {
    try {
      const query = await processQuery(req.query);

      if (query !== null) {
        const queriedBooks = await bookModel
          .find(query)
          .populate("author");

          res.status(200).json(queriedBooks);
      } else {
        res.status(200).send([]);
      }
    } catch (error) {
      next(error);
    }
  }
}

async function processQuery(queryParams) {
      const { publisher, title, minPrice, maxPrice, authorName } = queryParams;

      let query = {};

      if (publisher) query.publisher = { $regex: publisher, $options: "i" };
      if (title) query.title = {  $regex: title, $options: "i" };

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      if (authorName) {
        const author = await authorModel.findOne({ name: { $regex: authorName, $options: "i"} });

        if (author !== null) {
          query.author = author._id;
        } else {
          query = null
        }
      };

      if (Object.values(query).length === 0){
        query = null;
      }

    return query;
  }

export default BookController;
