export class DomainException extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}

export class NotFoundException extends DomainException {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundException';
  }
}

export class ValidationException extends DomainException {
  constructor(public readonly errors: any[]) {
    super('Validation failed', 'VALIDATION_ERROR', 400);
    this.name = 'ValidationException';
  }
}
