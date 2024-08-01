const ApiError = require('./api');

class UserDataValidationError extends ApiError {
  constructor() {
    super('User operation denied.', 401);
  }
}

module.exports = UserDataValidationError;
