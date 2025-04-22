const httpStatus = require('http-status');

class APIError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '', errors) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class BadRequestError extends APIError {
  constructor(message, errors) {
    super(httpStatus.BAD_REQUEST, message, true, '', errors);
  }
}

class NotFoundError extends APIError {
  constructor(message) {
    super(httpStatus.NOT_FOUND, message);
  }
}

class UnauthorizedError extends APIError {
  constructor(message) {
    super(httpStatus.UNAUTHORIZED, message);
  }
}

class ForbiddenError extends APIError {
  constructor(message) {
    super(httpStatus.FORBIDDEN, message);
  }
}

module.exports = {
  APIError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};