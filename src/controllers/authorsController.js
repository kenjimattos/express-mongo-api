import AuthorsService from "../services/authorsService.js";
import NotFoundError from "../middlewares/errors/notFoundError.js";

const authorsService = new AuthorsService();

class AuthorsController {
  static getAuthors(req, res, next) {
    try {
      const authorsList = authorsService.getAuthors();

      req.result = authorsList;

      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to list authors` });
    }
  }

  static async getAuthorById(req, res, next) {
    try {
      const id = req.params.id;
      const authorDoc = await authorsService.getAuthorById(id);

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
      const newAuthor = await authorsService.createAuthor(req.body);

      res
        .status(201)
        .json({ message: "Author created successfully", author: newAuthor });
    } catch (error) {
      next(error);
    }
  }

  static async updateAuthor(req, res, next) {
    try {
      const updatedAuthor = await authorsService.updateAuthor(req.params.id, req.body);

      if (updatedAuthor !== null) {
        res
          .status(200)
          .json({
            message: "Author updated successfully",
            author: updatedAuthor,
          });
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
      const deletedAuthor = await authorsService.removeAuthor(id);

      if (deletedAuthor !== null) {
        res
          .status(201)
          .json({
            message: "Author removed successfully",
            author: deletedAuthor,
          });
      } else {
        next(new NotFoundError("Could not remove author. Author ID not found"));
      }
    } catch (error) {
      next(error);
    }
  }


}

export default AuthorsController;
