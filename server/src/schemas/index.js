const defaultSchema = require('./default');
const signupSchema = require('./signup');
const loginSchema = require('./login');
const validateTokenSchema = require('./validateToken');
const checkoutSchema = require('./checkout');
const webAuthnSchema = require('./webauthn');

module.exports = {
  defaultSchema,
  signupSchema,
  loginSchema,
  validateTokenSchema,
  checkoutSchema,
  webAuthnSchema,
};
