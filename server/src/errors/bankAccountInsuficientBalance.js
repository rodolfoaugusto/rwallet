const ApiError = require('./api');

class BankAccountInsuficientBalanceError extends ApiError {
  constructor() {
    super('Bank account does not have sufficient funds.', 401);
  }
}

module.exports = BankAccountInsuficientBalanceError;
