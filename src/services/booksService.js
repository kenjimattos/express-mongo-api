import { authorModel, bookModel } from "../models/index.js";
import BadRequestError from "../middlewares/errors/badRequestError.js";

class BooksService {
  getBooks () {
    return bookModel.find().populate("author");
  }

  async getBookById(id) {
    return bookModel.findById(id).populate("author", "name").exec();
  }

  async createBook(data) {

    if (data.author) {
      const author = await authorModel.findById(data.author);

      if (!author) {
        throw new BadRequestError("Can't create book: author not found.", "UNEXISTING_AUTHOR");
      }
    }

    return bookModel.create(data);
  }

  async updateBook(req) {
    const id = req.params.id;
    return bookModel.findByIdAndUpdate(id, req.body, { new: true });
  }

  async removeBook(id) {
    return bookModel.findByIdAndDelete(id);
  }

  async queryBooks(query) {
    const processedQuery = await processQuery(query);

    return bookModel.find(processedQuery).populate("author");
  }
}


async function processQuery(queryParams) {
  const { publisher, title, minPrice, maxPrice, authorName } = queryParams;

  let query = {};

  if (publisher) query.publisher = { $regex: publisher, $options: "i" };
  if (title) query.title = { $regex: title, $options: "i" };

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (authorName) {
    const author = await authorModel.findOne({
      name: { $regex: authorName, $options: "i" },
    });

    if (author !== null) {
      query.author = author._id;
    } else {
      query = null;
    }
  }

  if (Object.values(query).length === 0) {
    query = null;
  }

  return query;
}

export default BooksService;