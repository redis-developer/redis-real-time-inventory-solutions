
interface IApiResponseBody {
    data: unknown;
    error: unknown;
    isFromCache?: boolean;
}
const HTTP_STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
};

const USERS = {
    DEFAULT: 'ADMIN',
};

const getPureError = (err: unknown) => {
    return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
}

export {
    HTTP_STATUS_CODES,
    USERS,
    getPureError
}


export type {
    IApiResponseBody
}