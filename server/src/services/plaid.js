const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const UserService = require('./user');
const CurrencyService = require('./currency');
const BitcoinNetworkService = require('./bitcoinNetwork');

const Config = require('../config');
const {
  GenerateLinkTokenError,
  UserDataValidationError,
  InvalidRequestError,
  InvalidTokenError,
  BankAccountInsuficientBalanceError,
  OfferExpiredError,
  TransactionIncompleteError,
} = require('../errors');

class PlaidService {
  user;

  constructor() {
    // Plaid configuration
    this.config = Config.plaid;

    // Currency service
    this.currency = new CurrencyService();

    // Set user
    this.setUser();

    // Plaid API configuration
    this.configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.config.clientId,
          'PLAID-SECRET': this.config.secret,
        },
      },
    });

    // TO-DO: Implementation of Virtual Account

    this.client = new PlaidApi(this.configuration);
  }

  setUser = (userId = false) => {
    this.user = new UserService(userId);
  };

  generateLinkToken = async (user) => {
    try {
      const tokenResponse = await this.client.linkTokenCreate({
        user: {
          client_user_id: user.id,
        },
        client_name: user.name,
        language: 'en',
        products: Config.plaid.scope, // Scope is based on country code availability -- https://plaid.com/global
        webhook: Config.plaid.webhook,
        country_codes: Config.plaid.countryCodes,
        auth: {
          automated_microdeposits_enabled: true,
        },
      });

      return tokenResponse.data;
    } catch {
      throw new GenerateLinkTokenError();
    }
  };

  getAccessToken = async (data) => {
    const findUser = await this.user.get(this.user.userId);

    const { publicToken, ...bankData } = data;

    if (findUser) {
      const response = await this.client.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const { access_token: accessToken } = response.data;

      await this.user.setBankAccounts(accessToken, bankData);
    } else {
      throw new InvalidTokenError();
    }
  };

  checkBalance = async (data) => {
    try {
      // Confirm bank account ownership
      const { accessToken, accountId } = await this.user.getBankAccount(
        data.bankAccount
      );

      // Get account balance
      const response = await this.client.accountsBalanceGet({
        access_token: accessToken,
      });

      // Check if account exists
      const bankAccount = response.data.accounts.find(
        (account) =>
          account.account_id === accountId &&
          account.balances.iso_currency_code === 'USD'
      );

      return bankAccount.balances.available;
    } catch {
      throw new UserDataValidationError();
    }
  };

  confirmOperation = async (data, cryptoAsset) => {
    await this.checkOfferDepreciation(data);

    if (data.amount > cryptoAsset.amount) {
      throw new TransactionIncompleteError();
    }

    const { address } = await this.user.getBalance();

    // Send Bitcoin to user
    const bitcoinNetwork = new BitcoinNetworkService(this.user.userId);

    await bitcoinNetwork.sendToAddress(cryptoAsset, address, data);

    await this.user.updateBalance(data.amount);
  };

  validateOperation = async (data) => {
    if (
      data.price > this.config.maxPriceOffer ||
      data.price < this.config.minPriceOffer
    ) {
      throw new InvalidRequestError();
    }

    const balance = await this.checkBalance(data);

    if (balance < data.price) {
      throw new BankAccountInsuficientBalanceError();
    }
  };

  checkOfferDepreciation = async (requestData) => {
    const { price: currentCurrencyUpdatedPrice } =
      this.currency.getCurrency('BTC');

    const { price, amount } = requestData;

    const bitcoinAmount = price / currentCurrencyUpdatedPrice; // in USD
    const bitcoinAmountAfterFee = parseFloat(
      (bitcoinAmount - this.calculateBitcoinTransactionFee()).toFixed(8)
    );

    // check if amount per same price variates more than 1% from the original request price offer
    if (bitcoinAmountAfterFee < amount * 0.99) {
      throw new OfferExpiredError();
    }
  };

  calculateBitcoinTransactionFee = () => {
    const feeRate = 4; // fastest rate variation between 4 and 5 satoshis per byte

    // Estimate the transaction size (e.g., 250 bytes for a simple transaction)
    const transactionSize = 250; // in bytes

    // calculate the fee
    const feeInSatoshis = feeRate * transactionSize;
    const feeInBitcoin = feeInSatoshis / 100000000; // convert satoshis to Bitcoin

    return feeInBitcoin;
  };
}

module.exports = PlaidService;
