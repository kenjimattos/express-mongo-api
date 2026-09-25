import BaseError from "./baseError.js";

class BadRequestError extends BaseError {
  constructor(message = "Bad request: One or more parameters not valid") {
    super(message, 400);
  }
}

export default BadRequestError;