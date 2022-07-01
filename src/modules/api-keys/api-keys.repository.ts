import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { ObjectID } from 'mongodb';

@EntityRepository(ApiKey)
export class ApiKeyRepository extends Repository<ApiKey> {
  findByUserId(userId: ObjectID): Promise<ApiKey[]> {
    return getMongoRepository(ApiKey).find({
      userId: userId,
    });
  }

  findOneByApiKey(apiKey: string): Promise<ApiKey> {
    return getMongoRepository(ApiKey).findOne({
      apiKey: apiKey,
    });
  }

  findOneById(id: string): Promise<ApiKey> {
    return getMongoRepository(ApiKey).findOne(new ObjectID(id));
  }

  createApiKey(apiKey: ApiKey): Promise<ApiKey> {
    return getMongoRepository(ApiKey).save(apiKey);
  }

  removeApiKey(apiKeyId: string) {
    return getMongoRepository(ApiKey).findOneAndDelete({
      _id: new ObjectID(apiKeyId),
    });
  }

  deleteApiKeysByMerchantId(merchantId: string) {
    return getMongoRepository(ApiKey).deleteMany({
      merchantId: new ObjectID(merchantId),
    });
  }
}
