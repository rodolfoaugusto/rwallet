const { InvalidRequestError } = require('../errors');

const sessionValidation = async (request) => {
  try {
    const sessionId = request.headers['x-session-id'];

    if (!sessionId) {
      throw new InvalidRequestError();
    }

    request.session = sessionId;
  } catch {
    throw new InvalidRequestError();
  }
};

module.exports = sessionValidation;
