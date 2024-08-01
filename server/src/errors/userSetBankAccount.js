const ApiError = require('./api');

class UserSetBankAccountError extends ApiError {
  constructor() {
    super('Bank resources cannot be reached.', 400);
  }
}

module.exports = UserSetBankAccountError;
