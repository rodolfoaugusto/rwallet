const fp = require('fastify-plugin');
const { PlaidService } = require('../services');

const plaidPlugin = async (fastify) => {
  fastify.decorateRequest('plaid', null);

  fastify.addHook('preHandler', async (request) => {
    request.plaid = new PlaidService();
  });
};

module.exports = fp(plaidPlugin);
