class BaseError extends Error {
  constructor(message = "Internal Server Error", status = 500, type = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.status = status;
    this.type = type;
  }

  sendResponse(res) {
    res.status(this.status).send({
      status: this.status,
      message: this.message,
      type: this.type
    });
  }
}

export default BaseError;