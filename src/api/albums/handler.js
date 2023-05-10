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
      year,
    } = request.payload;
    const result = await this._service.addAlbum({
      name,
      year,
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
      id,
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
      year,
    } = request.payload;
    const {
      id,
    } = request.params;
    await this._service.editAlbumById(id, {
      name,
      year,
    });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const {
      id,
    } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumLikeByIdHandler(request, h) {
    const albumId = request.params.id;
    const {
      id: userId,
    } = request.auth.credentials;

    await this._service.isAlbumExist(albumId);
    await this._service.verifyUserLike(albumId, userId);
    await this._service.addAlbumLikeById(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai lagu',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeByIdHandler(request) {
    const albumId = request.params.id;
    const {
      id: userId,
    } = request.auth.credentials;

    await this._service.isAlbumExist(albumId);
    await this._service.deleteAlbumLikeById(albumId, userId);

    return {
      status: 'success',
      message: 'Berhasil membatalkan untuk menyukai lagu',
    };
  }

  async getAlbumLikeByIdhandler(request, h) {
    const albumId = request.params.id;

    await this._service.isAlbumExist(albumId);
    const {
      likes,
      isCache,
    } = await this._service.getAlbumLikesById(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;