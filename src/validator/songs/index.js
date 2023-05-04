const InvariantError = require('../../exceptions/InvariantError');
const { SongsSchema } = require('./schema');

const songsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = songsValidator;
