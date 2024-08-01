const { BitcoinNetworkService } = require('../services');
const { defaultSchema, checkoutSchema } = require('../schemas');
const { tokenValidation, plaid } = require('../interceptors');

const route = (app, _opts, done) => {
  app.register(plaid);

  // Payment routes
  app.route({
    url: '/checkout',
    method: 'POST',
    schema: checkoutSchema,
    preHandler: tokenValidation,
    handler: async (request, reply) => {
      const { id } = request.user;

      request.plaid.setUser(id);

      // Validate price range and user bank account funds
      await request.plaid.validateOperation(request.body);

      // Prepare Bitcoin network client
      const bitcoinNetworkService = new BitcoinNetworkService(id);

      // Get crypto asset balance [SYSTEM BTC BALANCE]
      const cryptoAsset = await bitcoinNetworkService.getCryptoAsset();

      await request.plaid.confirmOperation(request.body, cryptoAsset);

      // Status 202 (accepted) | TO:DO -- Implement transaction status by webhook
      reply.status(202).send({
        data: reply.encrypt({ success: true }),
        message: 'Operation successful',
      });
    },
  });

  // Bank account routes
  app.route({
    url: '/bank-account/list',
    method: 'GET',
    schema: defaultSchema,
    preHandler: tokenValidation,
    handler: async (request, reply) => {
      request.plaid.setUser(request.user.id);

      const bankAccounts = await request.plaid.user.selectBankAccounts();

      reply.send({
        data: reply.encrypt(bankAccounts),
      });
    },
  });

  app.route({
    url: '/bank-account/request-link-token',
    method: 'POST',
    schema: defaultSchema,
    preHandler: tokenValidation,
    handler: async (request, reply) => {
      request.plaid.setUser(request.user.id);

      const user = await request.plaid.user.get(request.user.id);

      const linkToken = await request.plaid.generateLinkToken(user);

      reply.send({
        data: reply.encrypt(linkToken),
      });
    },
  });

  app.route({
    url: '/bank-account/register',
    method: 'POST',
    schema: defaultSchema,
    preHandler: tokenValidation,
    handler: async (request, reply) => {
      request.plaid.setUser(request.user.id);

      await request.plaid.getAccessToken(request.body);

      reply.status(201).send({
        data: reply.encrypt({ success: true }),
        message: 'Bank account created successfully',
      });
    },
  });

  done();
};

module.exports = route;
