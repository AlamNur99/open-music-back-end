const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, {
        playlistsService,
        playlistSongsService,
        songsService,
        validator,
    }) => {
        const playlistsHandler = new PlaylistHandler(
            playlistsService,
            playlistSongsService,
            songsService,
            validator,
        );
        server.route(routes(playlistsHandler));
    },
};