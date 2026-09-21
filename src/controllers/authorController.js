import { authorModel } from "../models/authorModel.js";

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
  static async getAuthorById(req, res) {
    try {
      const id  = req.params.id;
      const authorDoc = await authorModel.findById(id);
      res.status(200).json(authorDoc);
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to find author` });
    }
  }
  static async createAuthor(req, res) {
    try {
      const newAuthor = await authorModel.create(req.body);
      res.status(201).json({ message: "Author created successfully", author: newAuthor });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to create author` });
    }
  }
  static async updateAuthor(req, res) {
    try {
      const id  = req.params.id;
      await authorModel.findByIdAndUpdate(id, req.body);
      const updatedAuthor = await authorModel.findById(id);
      res.status(201).json({ message: "Author updated successfully", author: updatedAuthor });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to update author` });
    }
  }
  static async removeAuthor(req, res) {
    try {
      const id  = req.params.id;
      const deletedAuthor = await authorModel.findByIdAndDelete(id);
      res.status(201).json({ message: "Author removed successfully", author: deletedAuthor });
    } catch (error) {
      res
        .status(500)
        .json({ message: `${error.message} - failed to remove author` });
    }
  }
};

export default AuthorController;