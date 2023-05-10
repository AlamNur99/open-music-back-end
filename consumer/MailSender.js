const nodemailer = require('nodemailer');
const config = require('./utils/config');


class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass,
            },
        });
    }

    sendEmail(targetEmail, content) {
        const message = {
            from: 'Open Music',
            to: targetEmail,
            subject: 'Daftar lagu pada playlist',
            text: 'Terlampir hasil dari ekspor playlist',
            attachments: {
                filename: 'playlists.json',
                content,
            }
        };

        return this._transporter.sendMail(message);
    }
}

module.exports = MailSender;