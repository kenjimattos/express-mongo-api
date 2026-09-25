import BaseError from "./baseError.js";

class NotFoundError extends BaseError {
  constructor(message = "Route not found") {
    super(message, 404);
  }
}

export default NotFoundError; 