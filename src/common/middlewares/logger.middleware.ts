import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const xTranId = uuidv4();
    request.headers['x-transaction-id'] = xTranId;
    response.setHeader('x-transaction-id', xTranId);

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `[${xTranId}] ${method} ${originalUrl} ${statusCode} ${contentLength} <<< ${userAgent}-${ip}`,
      );
    });

    next();
  }
}
