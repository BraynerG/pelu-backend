export declare class DomainException extends Error {
    readonly message: string;
    readonly code: string;
    readonly statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare class NotFoundException extends DomainException {
    constructor(resource: string);
}
export declare class ValidationException extends DomainException {
    readonly errors: any[];
    constructor(errors: any[]);
}
