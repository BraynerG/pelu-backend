"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.NotFoundException = exports.DomainException = void 0;
class DomainException extends Error {
    message;
    code;
    statusCode;
    constructor(message, code, statusCode = 400) {
        super(message);
        this.message = message;
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'DomainException';
    }
}
exports.DomainException = DomainException;
class NotFoundException extends DomainException {
    constructor(resource) {
        super(`${resource} not found`, 'NOT_FOUND', 404);
        this.name = 'NotFoundException';
    }
}
exports.NotFoundException = NotFoundException;
class ValidationException extends DomainException {
    errors;
    constructor(errors) {
        super('Validation failed', 'VALIDATION_ERROR', 400);
        this.errors = errors;
        this.name = 'ValidationException';
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=domain.exception.js.map