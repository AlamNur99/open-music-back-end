const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const {
      name,
      year
    } = request.payload;
    const result = await this._service.addAlbum({
      name,
      year
    });

    const response = h.response({
      status: 'success',
      data: {
        albumId: result,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsByIdHandler(request) {
    const {
      id
    } = request.params;
    const result = await this._service.getSongsFromAlbumId(id);
    return {
      status: 'success',
      data: {
        album: result,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const {
      name,
      year
    } = request.payload;
    const {
      id
    } = request.params;
    await this._service.editAlbumById(id, {
      name,
      year
    });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const {
      id
    } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;