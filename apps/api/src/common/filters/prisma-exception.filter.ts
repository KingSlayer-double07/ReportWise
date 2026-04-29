import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('ERROR:', exception); // <-- never remove this

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Known network/database issues
    if (exception.code === 'EAI_AGAIN') {
      return response.status(503).json({
        statusCode: 503,
        message: 'Database temporarily unreachable (DNS issue)',
      });
    }

    if (exception.code === 'ECONNREFUSED') {
      return response.status(503).json({
        statusCode: 503,
        message: 'Database connection refused',
      });
    }

    // Let Nest handle known HTTP exceptions properly
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(
        exception.getResponse(),
      );
    }

    // Fallback
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: exception.message || 'Internal server error',
    });
  }
}