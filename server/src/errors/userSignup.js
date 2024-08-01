const ApiError = require('./api')

class UserSignupError extends ApiError {
  constructor() {
    super('User was not created, try again later.', 422)
  }
}

module.exports = UserSignupError
