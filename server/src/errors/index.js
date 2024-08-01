const MissingFieldsError = require('./missingFields');
const InvalidRequestError = require('./invalidRequest');
const UserSignupError = require('./userSignup');
const InvalidTokenError = require('./invalidToken');
const InvalidCredentialError = require('./invalidCredential');
const CurrencyListFetchError = require('./currencyListFetch');
const UserFetchError = require('./userFetch');
const UserSetBankAccountError = require('./userSetBankAccount');
const GenerateLinkTokenError = require('./generateLinkToken');
const UserDataValidationError = require('./userDataValidation');
const ServiceUnavailableError = require('./serviceUnavailable');
const BankAccountInsuficientBalanceError = require('./bankAccountInsuficientBalance');
const OfferExpiredError = require('./offerExpired');
const TransactionIncompleteError = require('./transactionIncomplete');
const InvalidPasskeyError = require('./invalidPasskey');

module.exports = {
  MissingFieldsError, // Auth missing fields error
  UserSignupError, // Auth signup error - duplicated or invalid email
  InvalidCredentialError, // Auth signin error - invalid credentials
  InvalidRequestError, // Ex: Request encrypt and decrypt failed -- Generic for request operations
  InvalidTokenError, // JWT error - invalid token
  CurrencyListFetchError, // Currency list fetch error
  UserFetchError, // User fetch error
  UserSetBankAccountError, // User set bank account error
  GenerateLinkTokenError, // Plaid generate link token error
  UserDataValidationError, // User validate data error -- Generic for user operations
  ServiceUnavailableError, // Service unavailable error -- Vital resources not available
  BankAccountInsuficientBalanceError, // Bank account insufficient balance error
  OfferExpiredError, // Offer expired error -- deprecated offer
  TransactionIncompleteError, // Transaction not completed by system insuficient balance error
  InvalidPasskeyError, // Invalid passkey error
};
