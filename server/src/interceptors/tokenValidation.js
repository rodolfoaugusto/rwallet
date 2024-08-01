const { InvalidTokenError } = require('../errors');

const tokenValidation = async (request) => {
  try {
    await request.jwtVerify();
  } catch {
    throw new InvalidTokenError();
  }
};

module.exports = tokenValidation;
