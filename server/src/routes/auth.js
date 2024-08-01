const { auth, tokenValidation, sessionValidation } = require('../interceptors');
const {
  signupSchema,
  loginSchema,
  validateTokenSchema,
  webAuthnSchema,
} = require('../schemas');

const route = (app, _opts, done) => {
  app.register(auth);

  app.route({
    url: '/login',
    method: 'POST',
    schema: loginSchema,
    handler: async (request, reply) => {
      const loginData = await request.auth.login(request.body);

      const accessToken = app.jwt.sign({
        ...loginData,
      });

      reply.status(200).send({
        data: reply.encrypt({
          ...{ ...loginData, accessToken },
        }),
        message: 'User successfully authenticated',
      });
    },
  });

  app.route({
    url: '/signup',
    method: 'POST',
    schema: signupSchema,
    handler: async (request, reply) => {
      const { id } = await request.auth.signUp(request.body);

      const accessToken = app.jwt.sign({
        id,
      });

      reply.status(201).send({
        data: reply.encrypt({
          ...{ id, accessToken },
        }),
        message: 'User created successfully',
      });
    },
  });

  app.route({
    url: '/validate-token',
    method: 'GET',
    schema: validateTokenSchema,
    preHandler: tokenValidation,
    handler: async (request, reply) => {
      // validate the token
      const { id, security } = request.user;

      // reset token expiry
      const accessToken = app.jwt.sign({
        id,
        security,
      });

      reply.send({
        valid: true,
        data: reply.encrypt({ id, security, accessToken }),
      });
    },
  });

  app.route({
    url: '/confirm-authentication',
    method: 'POST',
    name: 'Passkey Authentication Confirm',
    schema: webAuthnSchema,
    preHandler: [sessionValidation],
    handler: async (request, reply) => {
      const loginData = await request.auth.confirmAuthentication(
        request.session,
        request.body
      );

      const accessToken = app.jwt.sign({
        ...loginData,
      });

      reply.status(200).send({
        data: reply.encrypt({
          ...{ ...loginData, accessToken },
        }),
        message: 'User successfully authenticated',
      });
    },
  });

  app.route({
    url: '/generate-authentication-options',
    method: 'GET',
    name: 'Passkey Authentication Options',
    schema: webAuthnSchema,
    preHandler: [sessionValidation],
    handler: async (request, reply) => {
      const options = await request.auth.generateAuthentication(
        request.session
      );

      reply.send({
        data: reply.encrypt(options),
      });
    },
  });

  app.route({
    url: '/generate-registration-options',
    method: 'GET',
    name: 'Passkey Registration Options',
    schema: webAuthnSchema,
    preHandler: [tokenValidation, sessionValidation],
    handler: async (request, reply) => {
      const publicKey = await request.auth.generateRegistration(
        request.user.id,
        request.session
      );

      reply.send({
        data: reply.encrypt({ publicKey }),
      });
    },
  });

  app.route({
    url: '/confirm-registration',
    method: 'POST',
    name: 'Passkey Registration Confirm',
    schema: webAuthnSchema,
    preHandler: [tokenValidation, sessionValidation],
    handler: async (request, reply) => {
      const verified = await request.auth.confirmRegistration(
        request.user.id,
        request.session,
        request.body
      );

      reply.send({
        valid: true,
        data: reply.encrypt({ verified }),
      });
    },
  });

  done();
};

module.exports = route;
