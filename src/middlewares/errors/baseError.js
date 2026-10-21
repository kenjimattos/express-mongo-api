class BaseError extends Error {
  constructor(message = "Internal Server Error", status = 500) {
    super(message);
    this.status = status;
  }

  sendResponse(res) {
    res.status(this.status).send({
      status: this.status,
      message: this.message
    });
  }
}

export default BaseError;