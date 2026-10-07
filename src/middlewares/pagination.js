import BadRequestError from "../middlewares/errors/badRequestError.js";

async function pagination(req, res, next) {
  try {
    let { limit, page, orderBy = "_id:-1" } = req.query;

    limit = limit ? parseInt(limit) : 5;
    page = page ? parseInt(page) : 1;

    let [field, order] = orderBy.split(":");

    field = field ? field : "title";
    order = order ? parseInt(order) : 1;

    if (limit > 0 && page > 0) {
      const pagedList = await req.result.find()
        .sort({ [field]: order })
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