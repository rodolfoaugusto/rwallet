const ApiError = require('./api');

class CurrencyListFetchError extends ApiError {
  constructor() {
    super('Currency list is not available.', 403);
  }
}

module.exports = CurrencyListFetchError;
