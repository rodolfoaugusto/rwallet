class ApiError {
  constructor(message, status) {
    this.message = message;
    this.status = status;
  }
}

module.exports = ApiError;
