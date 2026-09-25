import NotFoundError from "./errors/notFoundError.js";

function notFoundHandler(req, res, next) {
  next(new NotFoundError());
}

export default notFoundHandler;