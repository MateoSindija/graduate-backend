import Logger from '@loaders/logger';
import { AppError } from './appError';
import { Server } from 'http';
import * as util from 'util';

let httpServerRef: Server;

const ErrorHandler = {
    // Listen to the global process-level error events
    listenToErrorEvents: (httpServer: Server) => {
        httpServerRef = httpServer;
        process.on('uncaughtException', async (error) => {
            ErrorHandler.handleError(error);
        });

        process.on('unhandledRejection', async (reason) => {
            ErrorHandler.handleError(reason);
        });

        process.on('SIGTERM', async () => {
            Logger.error(
                'App received SIGTERM event, try to gracefully close the server'
            );
            await terminateHttpServerAndExit();
        });

        process.on('SIGINT', async () => {
            Logger.error(
                'App received SIGINT event, try to gracefully close the server'
            );
            await terminateHttpServerAndExit();
        });
    },

    handleError: (errorToHandle: unknown) => {
        try {
            const appError: AppError = normalizeError(errorToHandle);
            Logger.error(appError.message, appError);

            // A common best practice is to crash when an unknown error (non-trusted) is being thrown
            if (!appError.isOperational) {
                terminateHttpServerAndExit();
            }
        } catch (handlingError: unknown) {
            // Not using the logger here because it might have failed
            process.stdout.write(
                'The error handler failed, here are the handler failure and then the origin error that it tried to handle'
            );
            process.stdout.write(JSON.stringify(handlingError));
            process.stdout.write(JSON.stringify(errorToHandle));
        }
    },
};

const terminateHttpServerAndExit = async () => {
    if (httpServerRef) {
        // Graceful shutdown
        httpServerRef.close(() => {
            process.exit(1);
        });

        // If a graceful shutdown is not achieved after 1 second,
        // shut down the process completely
        setTimeout(() => {
            process.abort(); // Exit immediately and generate a core dump file
        }, 1000).unref();
    }
    process.exit();
};

// The input might not be 'AppError' or even 'Error' instance,
// the output of this function will be - AppError.
const normalizeError = (errorToHandle: unknown): AppError => {
    if (errorToHandle instanceof AppError) {
        return errorToHandle;
    }

    if (errorToHandle instanceof Error) {
        const appError = new AppError(
            errorToHandle.name,
            errorToHandle.message
        );
        appError.stack = errorToHandle.stack;
        return appError;
    }

    // Meaning it could be any type,
    const inputType = typeof errorToHandle;
    return new AppError(
        'general-error',
        `Error Handler received a none error instance with type - ${inputType}, value - ${util.inspect(
            errorToHandle
        )}`
    );
};

export { ErrorHandler };
