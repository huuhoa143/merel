import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FP_API_KEY_HEADER } from '@/common/constants/http-header';
import { DappsService } from '@/modules/dapps/dapps.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly dappsService: DappsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers[FP_API_KEY_HEADER.toLowerCase()];
    if (!apiKeyHeader) throw new UnauthorizedException('AUTH.AUTH_ERROR');

    const dapp = await this.dappsService.findDappById(apiKeyHeader);
    if (!dapp) {
      throw new UnauthorizedException('AUTH.AUTH_ERROR');
    }
    request.dapp = dapp;
    return true;
  }
}
