import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import pino, { Options } from 'pino-http';

import { createNamespace } from 'cls-hooked';

const session = createNamespace('logger');

const options: Options = {
    // Add the transaction ID in the logs
    mixin() {
        return {
            transactionId: session.get('transactionId'),
        };
    },

    // Define a custom logger level
    customLogLevel: (_req, res, err) => {
        if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
        } else if (res.statusCode >= 500 || err) {
            return 'error';
        } else if (res.statusCode >= 300 && res.statusCode < 400) {
            return 'silent';
        }
        return 'info';
    },
};

export const PinoLogger = pino(options);

export type LoggerType = typeof PinoLogger.logger;

export default PinoLogger.logger;

export const loggerMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    session.run(() => {
        const transactionId = req.headers['transactionId'] || randomUUID();
        session.set('transactionId', transactionId);
        next();
    });
};
