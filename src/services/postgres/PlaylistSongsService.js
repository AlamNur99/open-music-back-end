const {
    Pool
} = require("pg");
const autoBind = require('auto-bind');
const {
    nanoid
} = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistSongsService {
    constructor(playlistsService) {
        this._pool = new Pool();
        this._playlistsService = playlistsService;

        autoBind(this);
    }

    async addSongToPlaylist(playlistId, userId, songId) {
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
        const id = `playlistsongs-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('Gagal menambahkan lagu kedalam playlist');
        }
    }

    async getSongsFromPlaylist(playlistId, userId) {
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
        const playlists = await this._playlistsService.getPlaylistById(
            userId,
            playlistId
        );
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM playlists
            INNER JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
            INNER JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlists.id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal diambil dari playlist');
        }

        return {
            ...playlists,
            songs: result.rows
        };
    }

    async deleteSongFromPlaylistId(playlistId, userId, songId) {
        await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError(
                'Gagal menghapus lagu dari playlist. Id tidak ditemukan'
            );
        }
    }
}

module.exports = PlaylistSongsService;