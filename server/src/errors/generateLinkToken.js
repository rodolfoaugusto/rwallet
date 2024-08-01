const ApiError = require('./api');

class GenerateLinkTokenError extends ApiError {
  constructor() {
    super('The authentication products are not available.', 401);
  }
}

module.exports = GenerateLinkTokenError;
