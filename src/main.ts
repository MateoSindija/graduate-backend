import 'reflect-metadata';

import * as dotenv from 'dotenv';
dotenv.config();

import Logger from '@loaders/logger';
import config from '@config/config';

import express from 'express';
import loader from '@loaders/index';
import { ErrorHandler } from '@errors/handler';

async function startServer() {
    const app = express();

    await loader({ expressApp: app });

    const server = app
        .listen(config.app.port, () => {
            Logger.info(`✅Server listening on port: ${config.app.port}`);
        })
        .on('error', (err) => {
            Logger.error(err);
            process.exit(1);
        });

    ErrorHandler.listenToErrorEvents(server)
}

startServer();
