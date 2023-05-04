const ClientError = require('./ClientError');

class AuthentiticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthentiticationError;
