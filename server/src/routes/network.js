const UserService = require('../services/user');

const { defaultSchema } = require('../schemas');
const { tokenValidation } = require('../interceptors');

const route = (app, _opts, done) => {
  app.route({
    url: '/balance',
    method: 'GET',
    schema: defaultSchema,
    preHandler: tokenValidation,
    handler: async (request, reply) => {
      const userService = new UserService(request.user.id);

      const balance = await userService.getBalance();

      reply.send({
        data: reply.encrypt({ ...balance }),
      });
    },
  });

  done();
};

module.exports = route;
