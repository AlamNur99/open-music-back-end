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
        this._validator.validatePostPlaylistPayload(request.payload);
        const {
            name,
        } = request.payload;
        const {
            id: owner,
        } = request.auth.credentials;

        const result = await this._playlistsService.addPlaylist(name, owner);

        const response = h.response({
            status: 'success',
            data: {
                playlistId: result,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request) {
        const {
            id: owner,
        } = request.auth.credentials;
        const result = await this._playlistsService.getPlaylistsByOwner(owner);
        return {
            status: 'success',
            data: {
                playlists: result,
            },
        };
    }

    async deletePlaylistHandler(request) {
        const {
            id: playlistId,
        } = request.params;
        const {
            id: owner,
        } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
        await this._playlistsService.deletePlaylistById(playlistId);
        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    async postSongToPlaylistHandler(request, h) {
        this._validator.validatePostSongToPlaylistPayload(request.payload);
        const {
            id: userId,
        } = request.auth.credentials;
        const {
            id: playlistId,
        } = request.params;
        const {
            songId,
        } = request.payload;

        await this._songsService.verifySongIsExist(songId);

        await this._playlistSongsService.addSongToPlaylist(
            playlistId,
            userId,
            songId,
        );

        await this._playlistsService.postActivity(playlistId, songId, userId, 'add');

        const response = h.response({
            status: 'success',
            message: 'Berhasil menambahkan lagu',
        });
        response.code(201);
        return response;
    }

    async getSongsFromPlaylistHandler(request, h) {
        const {
            id: userId,
        } = request.auth.credentials;
        const {
            id: playlistId,
        } = request.params;

        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
        const songsFromPlaylist = await this._playlistSongsService.getSongsFromPlaylistId(
            playlistId,
            userId,
        );

        const response = h.response({
            status: 'success',
            data: {
                playlist: songsFromPlaylist,
            },
        });
        response.code(200);
        return response;
    }

    async deleteSongFromPlaylistHandler(request) {
        this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
        const {
            id: userId,
        } = request.auth.credentials;
        const {
            id: playlistId,
        } = request.params;
        const {
            songId,
        } = request.payload;

        await this._playlistSongsService.deleteSongFromPlaylistId(
            playlistId,
            userId,
            songId,
        );

        await this._playlistsService.postActivity(playlistId, songId, userId, 'delete');

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }

    async getPlaylistActivitiesHandler(request) {
        const {
            id: playlistId,
        } = request.params;
        const {
            id: credentialId,
        } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

        const activitiesFiltered = await this._playlistsService.getPlaylistActivities(playlistId);

        return {
            status: 'success',
            data: {
                playlistId,
                activities: activitiesFiltered,
            },
        };
    }
}

module.exports = PlaylistsHandler;