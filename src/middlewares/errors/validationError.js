import BadRequestError from "./badRequestError.js";

class ValidationError extends BadRequestError {
  constructor(error) {
    const errorMessage = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");

    super(`Validation error: ${errorMessage}`, "VALIDATION_ERROR");
  }
}

export default ValidationError;