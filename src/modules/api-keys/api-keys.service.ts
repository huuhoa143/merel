import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { ApiKeyRepository } from './api-keys.repository';
import { ApiKey } from './entities/api-key.entity';
import { MAX_API_KEY_CREATED } from './constants/api-keys.constant';
import { v4 as uuidv4 } from 'uuid';
import { ObjectID } from 'mongodb';

@Injectable()
export class ApiKeyService {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  async getApiKey(apiKey: string) {
    return await this.apiKeyRepository.findOneByApiKey(apiKey);
  }

  async createApiKey(merchant: User) {
    // Limit 10 api keys
    const limit = MAX_API_KEY_CREATED;
    const userId = new ObjectID(merchant.id.toString());
    const allApiKeys = await this.apiKeyRepository.findByUserId(userId);
    if (allApiKeys.length >= limit) {
      throw new ForbiddenException('API_KEY.EXCEED_LIMIT');
    }

    // Create api key
    const uuid = uuidv4();
    const apiKey = new ApiKey();
    // TODO: optional field: apiKey.note = ;
    apiKey.userId = userId;
    apiKey.apiKey = uuid;
    return await this.apiKeyRepository.createApiKey(apiKey);
  }

  async removeApiKey(id: string) {
    // Check existing apikey
    const existingApiKey = await this.apiKeyRepository.findOneById(id);

    if (!existingApiKey) {
      throw new NotFoundException('API_KEY.NOT_FOUND');
    }
    await this.apiKeyRepository.removeApiKey(id);
    return;
  }

  async getAllApiKeys(userId: string) {
    return await this.apiKeyRepository.find({
      userId: new ObjectID(userId),
    });
  }
}
