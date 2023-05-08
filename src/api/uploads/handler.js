const autoBind = require('auto-bind');
const config = require('../../utils/config');

class UploadsHandler {
    constructor(service, albumsService, validator) {
        this._service = service;
        this._albumsService = albumsService;
        this._validator = validator;

        autoBind(this);
    }

    async postUploadImageHandler(request, h) {
        const {
            cover
        } = request.payload;
        const {
            id
        } = request.params;

        this._validator.validateImageHeaders(cover.hapi.headers);

        const filename = await this._service.writeFile(cover, cover.hapi);
        const coverUrl = `http://${config.app.host}:${config.app.port}/upload/images/${filename}`;

        await this._albumsService.editAlbumWithAddedCoverById(id, coverUrl);

        const response = h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        });
        response.code(201);
        return response;
    }
}

module.exports = UploadsHandler;