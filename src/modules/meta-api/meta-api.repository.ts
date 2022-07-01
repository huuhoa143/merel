import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { MetaApi } from './entities/meta-api.entity';

@EntityRepository(MetaApi)
export class MetaApiRepository extends Repository<MetaApi> {
  findMetaApiByNameAndDappIdAndContractId(
    name: string,
    dappId: string,
    smartContractId: string,
  ): Promise<MetaApi> {
    return getMongoRepository(MetaApi).findOne({
      where: {
        name: name,
        dappId: dappId,
        smartContractId: smartContractId,
      },
    });
  }

  saveMetaApi(metaApi: MetaApi): Promise<MetaApi> {
    return getMongoRepository(MetaApi).save(metaApi);
  }
}
