const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

const PostSongToPlaylistPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

const DeleteSongFromPlaylistPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = {
    PostPlaylistsPayloadSchema,
    PostSongToPlaylistPayloadSchema,
    DeleteSongFromPlaylistPayloadSchema,
};