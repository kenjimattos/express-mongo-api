import BadRequestError from "../middlewares/errors/badRequestError.js";
import parsePagination from "../utils/parsePagination.js";

async function pagination(req, res, next) {
  try {
    const { limit, page, sort } = parsePagination(req.query, req.result.schema);

    if (limit > 0 && page > 0) {
      const pagedList = await req.result.find()
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      res.status(200).json(pagedList);
    } else {
      next(new BadRequestError("Limit and page must be greater than 0"));
    }
  } catch (error) {
    next(error);
  }
}

export default pagination;