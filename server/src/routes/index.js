const auth = require('./auth');
const purchase = require('./purchase');
const currency = require('./currency');
const network = require('./network');

module.exports = async (app) => {
  app.register(auth, { prefix: '/auth' });
  app.register(purchase, { prefix: '/purchase' });
  app.register(currency, { prefix: '/currency' });
  app.register(network, { prefix: '/network' });
};
