import { authorModel } from "../models/index.js";
import BadRequestError from "../middlewares/errors/badRequestError.js";

class AuthorsService {
  getAuthors() {
    return authorModel.find({});
  }

  async getAuthorById(id) {
    return authorModel.findById(id);
  }

  async createAuthor(data) {
    const existingAuthor = await authorModel.findOne({ name: data.name });

    if (existingAuthor) {
      throw new BadRequestError("Can't create author: an author with this name already exists.", "AUTHOR_NAME_ALREADY_EXISTS");
    }

    return authorModel.create(data);
  }

  async updateAuthor(id, data) {
    return authorModel.findByIdAndUpdate(id, data, { new: true });
  }

  async removeAuthor(id) {
    return authorModel.findByIdAndDelete(id);
  }
}

export default AuthorsService;