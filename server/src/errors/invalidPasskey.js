const ApiError = require('./api');

class InvalidPasskeyError extends ApiError {
  constructor() {
    super('The passkey cannot be validated.', 400);
  }
}

module.exports = InvalidPasskeyError;
