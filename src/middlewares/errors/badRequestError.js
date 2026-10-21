import BaseError from "./baseError.js";

class BadRequestError extends BaseError {
  constructor(message = "Bad request: One or more parameters not valid", type = "BAD_REQUEST") {
    super(message, 400, type);
  }
}

export default BadRequestError;