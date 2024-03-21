import {
    Catch,
    ArgumentsHost,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type ResponseObject = {
    statusCode: number;
    timestamp: string;
    path: string;
    response: string | object;
};

@Catch()
export class AllExceptionFilrer extends BaseExceptionFilter {
    private readonly logger = new CustomLoggerService(AllExceptionFilrer.name);

    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const responseObject: ResponseObject = {
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: '',
        };
        if (exception instanceof HttpException) {
            responseObject.statusCode = exception.getStatus();
            responseObject.response = exception.getResponse();
        } else if (exception instanceof PrismaClientValidationError) {
            responseObject.statusCode = 422;
            responseObject.response = exception.message.replaceAll(/\n/g, '');
        } else {
            responseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            responseObject.response = 'Internal Server Error';
        }
        response.status(responseObject.statusCode).json(responseObject);
        this.logger.error(responseObject.response, BaseExceptionFilter.name);
        super.catch(exception, host);
    }
}
