const ApiError = require('./api');

class ServiceUnavailableError extends ApiError {
  constructor() {
    super('The system is not reachable.', 503);
  }
}

module.exports = ServiceUnavailableError;
