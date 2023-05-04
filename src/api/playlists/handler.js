const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(playlistsService, playlistSongsService, songsService, validator) {
        this._playlistsService = playlistsService;
        this._playlistSongsService = playlistSongsService;
        this._songsService = songsService;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistsPayload(request.payload);
        const {
            name
        } = request.payload;
        const {
            id: credentialId
        } = request.auth.credentials;

        const playlistId = await this._playlistsService.addPlaylist({
            name,
            owner: credentialId,
        });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });

        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request) {
        const {
            id: credetialId
        } = request.auth.credentials;
        const playlists = await this._playlistsService.getPlaylists(credetialId);
        return {
            status: 'success',
            data: {
                playlists,
            }
        }
    }

    async deletePlaylistByIdHandler(request, h) {
        const {
            id
        } = request.params;
        const {
            id: credentialId
        } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(id, credentialId);
        await this._playlistsService.deletePlaylistById(id);

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    async postSongToPlaylistHandler(request, h) {
        this._validator.validatePostSongToPlaylistPayload(request.payload);
        const {
            id: credentialId
        } = request.auth.credentials;
        const {
            id: playlistId
        } = request.params;
        const {
            songId
        } = request.payload;

        await this._songsService.verifySongIsExist(songId);
        await this._playlistsService.addSongToPlaylist(playlistId, credentialId, songId);

        const response = h.response({
            status: 'success',
            message: 'Berhasil menambahkan lagu',
        });
        response.code(201);
        return response;
    }

    async getSongsFromPlaylistHandler(request, h) {
        const {
            id: credentialId
        } = request.auth.credentials;
        const {
            id: playlistId
        } = request.params;

        const playlist = await this._playlistSongsService.getSongsFromPlaylist(playlistId, credentialId);

        const response = h.response({
            status: 'success',
            data: {
                playlist,
            }
        });
        response.code(200);
        return response;
    }

    async deleteSongFromPlaylistHandler(request) {
        this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
        const {
            id: credentialId
        } = request.auth.credentials;
        const {
            id: playlistId
        } = request.params;
        const {
            songId
        } = request.payload;

        await this._playlistSongsService.deleteSongFromPlaylistId(
            playlistId,
            credentialId,
            songId
        );

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
}

module.exports = PlaylistsHandler;