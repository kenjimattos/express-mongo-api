import { authorModel } from "../models/authorModel.js";
import NotFoundError from "../middlewares/errors/notFoundError.js";

class AuthorController {
  static async getAuthors(req, res) {
    try {
      const authorsList = await authorModel.find({});
      res.status(200).json(authorsList);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to list authors` });
    }
  }

  static async getAuthorById(req, res, next) {
    try {
      const id = req.params.id;
      const authorDoc = await authorModel.findById(id);
      if (authorDoc !== null) {
        res.status(200).json(authorDoc);
      } else {
        next(new NotFoundError("Could not find author. Author ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async createAuthor(req, res, next) {
    try {
      const newAuthor = await authorModel.create(req.body);

      if (newAuthor !== null) {
        res.status(201).json({ message: "Author created successfully", author: newAuthor });
      } else {
        next(new NotFoundError("Could not create author"));
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateAuthor(req, res, next) {
    try {
      const id = req.params.id;
      await authorModel.findByIdAndUpdate(id, req.body);
      const updatedAuthor = await authorModel.findById(id);

      if (updatedAuthor !== null) {
        res.status(201).json({ message: "Author updated successfully", author: updatedAuthor });
      } else {
        next(new NotFoundError("Could not update author. Author ID not found"));
      }

    } catch (error) {
      next(error);
    }
  }

  static async removeAuthor(req, res, next) {
    try {
      const id = req.params.id;
      const deletedAuthor = await authorModel.findByIdAndDelete(id);

      if (deletedAuthor !== null) {
        res.status(201).json({ message: "Author removed successfully", author: deletedAuthor });
      } else {
        next(new NotFoundError("Could not remove author. Author ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }
};

export default AuthorController;