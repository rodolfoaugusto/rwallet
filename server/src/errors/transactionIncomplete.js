const ApiError = require('./api');

class TransactionIncompleteError extends ApiError {
  constructor() {
    super('This transaction cannot be completed right now.', 410);
  }
}

module.exports = TransactionIncompleteError;
