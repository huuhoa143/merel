import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import * as _ from 'lodash';

// Page start from 1, not 0
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

@Injectable()
export class PagingInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { page, limit } = this.getPageAndLimit(request);

    if (request.query) {
      request.query.limit = limit;
      request.query.page = page;
    }
    if (request.body) {
      request.body.limit = limit;
      request.body.page = page;
    }
    return next.handle();
  }

  /**
   * Get Page And Limit From Body Or Query
   * @param {Request} request
   */
  private getPageAndLimit(request: Request) {
    const { query, body } = request;
    let page = _.get(query, 'page') || _.get(body, 'page');
    let limit = _.get(query, 'limit') || _.get(body, 'limit');
    if (!page || page <= 0) page = DEFAULT_PAGE;
    if (!limit || limit <= 0) {
      limit = DEFAULT_LIMIT;
    } else {
      limit > MAX_LIMIT ? (limit = MAX_LIMIT) : limit;
    }
    return { page, limit };
  }
}
