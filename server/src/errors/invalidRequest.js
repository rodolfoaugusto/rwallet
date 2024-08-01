const ApiError = require('./api');

class InvalidRequestError extends ApiError {
  constructor() {
    super('The request is not valid.', 400);
  }
}

module.exports = InvalidRequestError;
