import { Injectable, Logger } from '@nestjs/common';
import { SessionsRepository } from '@/modules/sessions/sessions.repository';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly sessionsRepository: SessionsRepository, // private readonly awsService: AwsService,
  ) {}

  async findBySessionId(sessionId) {
    return await this.sessionsRepository.findBySessionId(sessionId);
  }

  async createSession(session) {
    return await this.sessionsRepository.createSession(session);
  }

  async deleteSession(sessionId) {
    return await this.sessionsRepository.deleteSession(sessionId);
  }

  async getRepository() {
    return this.sessionsRepository;
  }

  async deleteSessionsByMerchantId(merchantId: string) {
    return await this.sessionsRepository.deleteSessionsByMerchantId(merchantId);
  }
}
