const process = require('process');
const fastify = require('fastify');
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');

const { encrypt, decrypt } = require('./interceptors');
const Config = require('./config');
const routes = require('./routes');

const bootstrap = async () => {
  const app = fastify({
    logger: false,
  });

  // Interceptors
  await app.register(decrypt);
  await app.register(encrypt);

  // Plugins
  await app.register(cors);
  await app.register(jwt, {
    secret: Config.jwt.secret,
    expiresIn: Config.jwt.expiration,
  });

  // Add Routes
  app.register(routes);

  app.listen({ port: Config.apiPort, host: '0.0.0.0' }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
};

bootstrap();
