const fp = require('fastify-plugin');
const { AuthService } = require('../services');

const AuthPlugin = async (fastify) => {
  fastify.decorateRequest('auth', null);

  fastify.addHook('preHandler', async (request) => {
    request.auth = new AuthService();
  });
};

module.exports = fp(AuthPlugin);
