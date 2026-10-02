import mongoose from "mongoose";
import BadRequestError from "./errors/badRequestError.js";
import BaseError from "./errors/baseError.js";
import NotFoundError from "./errors/notFoundError.js";
import ValidationError from "./errors/validationError.js";

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {

  if (error instanceof mongoose.Error.CastError) {
    new BadRequestError().sendResponse(res);
  } else if (error instanceof mongoose.Error.ValidationError) {
    new ValidationError(error).sendResponse(res);
  } else if (error instanceof NotFoundError) {
    error.sendResponse(res);
  } else {
    new BaseError().sendResponse(res);
  }
}

export default errorHandler;