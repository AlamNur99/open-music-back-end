const {
    Pool
} = require("pg");
const NotFoundError = require("../src/exceptions/NotFoundError");
const InvariantError = require("../src/exceptions/InvariantError");

class PlaylistsService {
    constructor() {
        this._pool = new Pool;
    }

    async getPlaylistById(playlistId) {
        const query = {
            text: 'SELECT id, name FROM playlists WHERE id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
    }

    async getSongsFromPlaylistId(playlistId) {
        const playlists = await this.getPlaylistById(playlistId);

        const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM playlists
            INNER JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
            INNER JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlists.id = $1`,
            values: [playlistId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new InvariantError('Gagal mengambil lagu dari playlist');
        }

        return {
            ...playlists,
            songs: result.rows,
        };
    }
}

module.exports = PlaylistsService;