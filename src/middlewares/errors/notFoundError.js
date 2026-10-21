import BaseError from "./baseError.js";

class NotFoundError extends BaseError {
  constructor(message = "Route not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export default NotFoundError; 