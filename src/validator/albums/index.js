const InvariantError = require('../../exceptions/InvariantError');
const { AlbumsSchema } = require('./schema');

const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = albumsValidator;
