const ApiError = require('./api');

class UserFetchError extends ApiError {
  constructor() {
    super('User not found.', 404);
  }
}

module.exports = UserFetchError;
