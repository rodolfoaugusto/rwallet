const ApiError = require('./api')

class MissingFieldsError extends ApiError {
  constructor() {
    super('Missing required fields.', 400)
  }
}

module.exports = MissingFieldsError
