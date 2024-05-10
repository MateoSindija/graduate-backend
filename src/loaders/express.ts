import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import routes from '../api/';
import config from '@config/config';
import {AppError} from '@errors/appError';
import {StatusCodes} from 'http-status-codes';
import {ErrorHandler} from '@errors/handler';
import {CommonErrors} from '@errors/common';
import {loggerMiddleware, PinoLogger} from './logger';

export default ({app}: { app: express.Application }) => {
    /**
     * Health Check endpoints
     * @TODO Explain why they are here
     */
    app.get('/status', (_req: Request, res: Response) => {
        res.status(200).end();
    });
    app.head('/status', (_req: Request, res: Response) => {
        res.status(200).end();
    });

    // Add the transaction ID of each request into the CLS namespace
    app.use(loggerMiddleware);

    // Use Pino logger for logging
    app.use(PinoLogger);

    // Set a static folder
    app.use(express.static('../../public/'));

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    // The magic package that prevents frontend developers going nuts
    // Alternate description:
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(
        cors({
            credentials: true,
            origin: [
                'http://localhost:8080',
            ],
        })
    );

    // Transforms the raw string of req.body into json
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Load API routes
    app.use(config.app.prefix, routes());

    // Catch 404 and forward it to the error handler
    app.use((_req: Request, _res: Response, next: NextFunction) => {
        const error = new AppError(
            CommonErrors.NOT_FOUND,
            'Route not found.',
            StatusCodes.NOT_FOUND
        );

        next(error);
    });

    // Error handler
    app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
        if (error && typeof error === 'object') {
            if (
                error.isOperational === undefined ||
                error.isOperational === null
            ) {
                error.isOperational = true; // Error during a specific request is usually not fatal and should not lead to process exit
            }
        }

        ErrorHandler.handleError(error);

        // Answer app errors with a message to the client
        if (error instanceof AppError) {
            res.status(error?.status || 500).json({message: error.message});
            return;
        }

        res.status(error?.status || 500).end();
    });
};
