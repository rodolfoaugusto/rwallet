const ApiError = require('./api');

class InvalidCredentialError extends ApiError {
  constructor() {
    super('Invalid credentials.', 401);
  }
}

module.exports = InvalidCredentialError;
