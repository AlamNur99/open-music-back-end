const InvariantError = require('../../exceptions/InvariantError');
const UserPayloadSchema = require('./schema');

const UserValidator = {
  validateUserPayload: (payload) => {
    const validationsResult = UserPayloadSchema.validate(payload);

    if (validationsResult.error) {
      throw new InvariantError(validationsResult.error.message);
    }
  },
};

module.exports = UserValidator;
