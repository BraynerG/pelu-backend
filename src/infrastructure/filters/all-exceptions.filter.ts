import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException, ValidationException } from '../../domain/exceptions/domain.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details = null;

    if (exception instanceof DomainException) {
      status = exception.statusCode;
      message = exception.message;
      code = exception.code;
      if (exception instanceof ValidationException) {
        details = exception.errors;
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      message = exceptionResponse.message || exception.message;
      code = 'HTTP_EXCEPTION';
      if (Array.isArray(exceptionResponse.message)) {
          details = exceptionResponse.message; // class-validator errors
      }
    } else if (exception instanceof Error) {
        message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
