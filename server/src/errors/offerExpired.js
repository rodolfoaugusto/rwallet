const ApiError = require('./api');

class OfferExpiredError extends ApiError {
  constructor() {
    super('This offer is no longer valid, please try again.', 410);
  }
}

module.exports = OfferExpiredError;
