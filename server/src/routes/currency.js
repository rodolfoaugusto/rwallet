const CurrencyService = require('../services/currency');

const { defaultSchema } = require('../schemas');

const route = (app, _opts, done) => {
  app.route({
    url: '/all',
    method: 'GET',
    schema: defaultSchema,
    handler: async (request, reply) => {
      const { listCurrency } = new CurrencyService();

      const currencies = await listCurrency();

      reply.send({
        data: reply.encrypt({ ...currencies }),
      });
    },
  });

  done();
};

module.exports = route;
