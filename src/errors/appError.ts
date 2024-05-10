import { StatusCodes } from 'http-status-codes';
import { CommonErrors } from './common';

export class AppError extends Error {
    public readonly name: string;
    public readonly status: StatusCodes;
    public readonly isOperational: boolean;

    constructor(
        name: string,
        description: string,
        status: StatusCodes = 500,
        isOperational = true
    ) {
        super(description);

        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain from the native Error object

        this.name = name;
        this.status = status;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError {
    constructor(description: string) {
        super(CommonErrors.NOT_FOUND, description, StatusCodes.NOT_FOUND);
    }
}

export class ForbiddenError extends AppError {
    constructor(description: string) {
        super(CommonErrors.FORBIDDEN, description, StatusCodes.FORBIDDEN);
    }
}

export class LoggedOnAnotherDeviceError extends AppError {
    constructor(description: string) {
        super(CommonErrors.UNAUTHORIZED, description, StatusCodes.UNAUTHORIZED);
    }
}
