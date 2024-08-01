const CryptoJS = require('crypto-js');
const fp = require('fastify-plugin');

const Config = require('../config');
const { InvalidRequestError } = require('../errors');

const encryptedPayload = (data) => {
  try {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      Config.encryption.secretKey
    ).toString();
  } catch {
    throw new InvalidRequestError();
  }
};

const encrypt = fp(async (server) => {
  server.decorateReply('encrypt', encryptedPayload);
});

const decryptPayload = (data) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      data.payload,
      Config.encryption.secretKey
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch {
    throw new InvalidRequestError();
  }
};

const decrypt = fp(async (server) => {
  server.addHook('preHandler', async (request) => {
    if (request.body && request.body.payload) {
      request.body = decryptPayload(request.body);
    }
  });
});

module.exports = { encrypt, decrypt };
