import { UNKNOWN_ERR_CODE } from '../constants/error-message';

const errorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  I_AM_A_TEAPOT: 418,
  MISDIRECTED: 421,
  UNPROCESSABLE_ENTITY: 422,
  FAILED_DEPENDENCY: 424,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
};
export function messageToStatusCode(message) {
  if (typeof message === 'string') {
    if (message === 'Unauthorized') {
      return ['AUTH.AUTH_ERROR', 401];
    }
    const regex = new RegExp(/^[A-Z._]+$/);
    if (regex.test(message)) {
      const errorMessage = message.split('.')[1];
      if (errorCodes[errorMessage]) {
        return [message, errorCodes[errorMessage]];
      } else {
        return [message, 400];
      }
    } else {
      return [UNKNOWN_ERR_CODE, 500];
    }
  } else {
    return [message, 500];
  }
}
