// App Configuration File
const env = process.env.NODE_ENV; // Get the ENV state ( DEV / PROD )

const development = {
    app: {
        port: parseInt(process.env.PORT ?? "", 10) || 4000,
        clientUrl: process.env.DEV_CLIENT_URL || 'http://localhost:3000',
        prefix: '/',
    },
    jwt: {
        secret: process.env.DEV_JWT_SECRET || 'secret',
        reset_secret: process.env.DEV_JWT_RESET_SECRET || 'secret2',
    },
    postgres: {
        host: process.env.DEV_POSTGRES_HOST || 'localhost',
        user: process.env.DEV_POSTGRES_USER || 'postgres',
        port: parseInt(process.env.DEV_POSTGRES_PORT ?? "", 10) || '5432',
        password: process.env.DEV_POSTGRES_PASS || 'admin',
        database: process.env.DEV_POSTGRES_DB || 'test',
    },
};

const production = {
    app: {
        port: parseInt(process.env.PORT ?? "", 10) || 4000,
        clientUrl: process.env.PROD_CLIENT_URL || 'https://admin.koena.app',
        prefix: '/',
    },
    jwt: {
        secret: process.env.PROD_JWT_SECRET || 'thisisapublicsecret',
        reset_secret:
            process.env.PROD_JWT_RESET_SECRET || 'thisisasecondpublicsecret',
    },
    postgres: {
        host:
            process.env.PROD_POSTGRES_HOST ||
            'koena.cmbghw53qjqy.eu-central-1.rds.amazonaws.com',
        user: process.env.PROD_POSTGRES_USER || 'postgres',
        port: parseInt(process.env.PROD_POSTGRES_PORT ?? "", 10) || '5432',
        password: process.env.PROD_POSTGRES_PASS || 'tuzfav-mehqaR-capdi8',
        database: process.env.PROD_POSTGRES_DB || 'postgres',
    },
};

const config = {
    development,
    production,
};

export const isDev = env !== 'production';
export default config[env || 'development']; // Export the required config
