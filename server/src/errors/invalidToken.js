const ApiError = require('./api');

class InvalidTokenError extends ApiError {
  constructor() {
    super('The token was declined.', 401);
  }
}

module.exports = InvalidTokenError;
