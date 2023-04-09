const HttpResponseCodes = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

interface HttpError extends Error {
    statusCode: number,
    data: unknown
}

class HttpError extends Error {
    constructor({ message, name, statusCode, data }: HttpError) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.data = data;
        Error.captureStackTrace(this, HttpError);
    }
}

class HttpBadRequest extends HttpError {
    constructor(message = 'Bad request', data: any) {
        super({
            message,
            name: "HttpBadRequest",
            statusCode: HttpResponseCodes.BAD_REQUEST,
            data
        });
    }
}

class HttpNotFound extends HttpError {
    constructor(message = 'Not Found', data: any) {
        super({
            message,
            name: "HttpNotFound",
            statusCode: HttpResponseCodes.NOT_FOUND,
            data
        });
    }
}

class HttpInternalServerError extends HttpError {
    constructor(message = 'Internal server error', data: any) {
        super({
            message,
            name: "HttpInternalServerError",
            statusCode: HttpResponseCodes.INTERNAL_SERVER_ERROR,
            data
        });
    }
}

export {
    HttpError,
    HttpBadRequest,
    HttpNotFound,
    HttpInternalServerError,
    HttpResponseCodes
}