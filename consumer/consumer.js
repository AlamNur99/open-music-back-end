require('dotenv').config();

const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
const config = require('./utils/config');

const init = async () => {
    const playlistsService = new PlaylistsService;
    const mailSender = new MailSender;
    const listener = new Listener(playlistsService, mailSender);

    const connection = await amqp.connect(config.rabbitmq.server);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlists', {
        durable: true,
    });

    channel.consume('export:playlists', listener.listen, {
        noAck: true
    });
};

init();