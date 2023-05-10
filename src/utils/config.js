const config = {
    app: {
        host: process.env.HOST,
        port: process.env.PORT,
    },
    jwt: {
        accessTokenKey: process.env.ACCESS_TOKEN_KEY,
        refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
        accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    },
    rabbitmq: {
        server: process.env.RABBITMQ_SERVER,
    },
    redis: {
        host: process.env.REDIS_SERVER,
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
};

module.exports = config;