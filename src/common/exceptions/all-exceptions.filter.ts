import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import {
  CustomErrorMessage,
  UNKNOWN_ERR_CODE,
  UNKNOWN_ERR_DESC,
  VALIDATION_ERR_CODE,
} from '../constants/error-message';
import { messageToStatusCode } from '../utility/message-to-status-code.utility';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    let { body } = request;
    const { query, route, method, url } = request;
    const response = ctx.getResponse<Response>();
    const ignoreRoute = [
      '/auth/login',
      '/users/edit-password',
      '/auth/get-security',
      '/users/change-password',
      '/security/enable-email-security',
      '/security/disable-email-security',
      '/security/get-image-2fa',
      '/security/enable-2fa',
      '/security/disable-2fa',
      '/security/verify-otp',
      '/security/verify-password',
    ];
    if (ignoreRoute.includes(url)) {
      body = {};
    }
    const requestInfo = { body, query, url, method, route: route?.path };

    let messageCode: string,
      description: string,
      msg: any,
      errorDetails = '';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR; //Default is always 500 internal error
    let errorName: string;
    if (exception instanceof HttpException) {
      errorName = 'HttpException';
      const exObj = exception.getResponse();
      errorDetails = exObj['error'];
      msg = exObj['message'];
      statusCode = exception.getStatus();
      // Check if msg is type of validation NormalizeError array
      if (Array.isArray(msg) && msg.length > 0) {
        const firstError = msg[0];
        if ('field' in firstError && 'errorDetail' in firstError) {
          const { errorDetail } = firstError;
          for (const k in errorDetail) {
            const errorDetailMsg = errorDetail[k];
            if (errorDetailMsg in CustomErrorMessage) {
              messageCode = errorDetailMsg;
              description = CustomErrorMessage[errorDetailMsg].description;
            } else {
              messageCode = VALIDATION_ERR_CODE;
              description = errorDetailMsg;
            }
          }
        }
      }
    } else if (exception instanceof Error) {
      errorName = 'Error';
      msg = exception.message;
      if (msg.includes('UNKNOWN:')) {
        // GRPC exception
        const arr = msg.split(':');
        if (arr?.length > 0) {
          msg = arr[1].trim();
        }
      } else {
        const [resString, errStatusCode] = messageToStatusCode(
          exception.message,
        );
        messageCode = resString;
        description = CustomErrorMessage[messageCode]
          ? CustomErrorMessage[messageCode].description
          : UNKNOWN_ERR_DESC;
        statusCode = errStatusCode;
      }
    }
    // Check if there is a custom message error
    if (!messageCode) {
      if (msg && CustomErrorMessage.hasOwnProperty(msg)) {
        messageCode = CustomErrorMessage[msg].messageCode;
        description = CustomErrorMessage[msg].description;
      } else {
        messageCode = UNKNOWN_ERR_CODE;
        description = UNKNOWN_ERR_DESC;
      }
    }
    // Response
    const responseObj = {
      messageCode,
      description,
      statusCode,
      errorDetails,
    };
    const errorData = {
      errorName,
      exception,
      url,
      request: requestInfo,
      merchantEmail: request['merchant']?.email,
    };
    const logMsg = JSON.stringify(responseObj);
    this.handleLogger(logMsg, errorData);
    this.handleResponse(responseObj, response);
  }

  handleLogger(message: string, errorData: any) {
    this.logger.error(
      message,
      JSON.stringify({
        type: errorData.errorName,
        date: new Date(),
        exception: errorData.exception.stack,
        apiUrl: errorData.url,
        request: errorData.request,
      }),
      errorData.merchantEmail,
    );
  }

  handleResponse(responseObj: any, response: any) {
    return response.status(responseObj.statusCode).json({
      description: responseObj.description,
      messageCode: responseObj.messageCode,
      errorDetails: responseObj.errorDetails,
    });
  }
}
