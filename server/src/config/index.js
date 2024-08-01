// Load environment variables
const process = require('process');
require('dotenv').config();

APPLICATION_NAME = 'R Wallet';
APPLICATION_DOMAIN = 'localhost';

const Config = {
  application: {
    name: process.env.APPLICATION_NAME || 'R Wallet',
    domain: process.env.APPLICATION_DOMAIN || 'localhost',
    expectedOrigin:
      process.env.APPLICATION_EXPECTED_ORIGIN || 'http://localhost:4200',
  },
  apiPort: process.env.API_PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'secret', // JWT
    expiration: process.env.JWT_EXPIRATION || '15m', // JWT
  },
  encryption: {
    secretKey: process.env.ENCRYPTION_SECRET_KEY || 'secret', // CryptoJS
    passwordSaltRounds: process.env.ENCRYPTION_PASSWORD_SALT || 10, // Bcrypt
  },
  bitcoinNetwork: {
    host: process.env.BITCOIN_PRIVATE_NETWORK_HOST || '127.0.0.1', // Bitcoin network (regtest)
    username: process.env.BITCOIN_PRIVATE_NETWORK_USERNAME || 'username',
    password: process.env.BITCOIN_PRIVATE_NETWORK_PASSWORD || 'password',
  },
  plaid: {
    clientId: process.env.PLAID_CLIENT_ID || 'client_id',
    secret: process.env.PLAID_SECRET || 'secret',
    countryCodes: process.env.PLAID_COUNTRY_CODES
      ? process.env.PLAID_COUNTRY_CODES.split(',')
      : ['US'],
    scope: process.env.PLAID_OAUTH_SCOPE
      ? process.env.PLAID_OAUTH_SCOPE.split(',')
      : [],
    minPriceOffer: +process.env.MIN_PRICE_OFFER || 10,
    maxPriceOffer: +process.env.MAX_PRICE_OFFER || 1000,
    webhook:
      process.env.PLAID_WEBHOOK_URL || 'http://localhost:3000/webhook/plaid',
  },
};

module.exports = Config;
