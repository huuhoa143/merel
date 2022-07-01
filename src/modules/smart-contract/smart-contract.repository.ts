import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { SmartContract } from './entities/smart-contract.entity';
import { ObjectID } from 'mongodb';

@EntityRepository(SmartContract)
export class SmartContractRepository extends Repository<SmartContract> {
  findSmartContractByNameAndDappId(
    name: string,
    dappId: string,
  ): Promise<SmartContract> {
    return getMongoRepository(SmartContract).findOne({
      where: {
        name: name,
        dappId: dappId,
      },
    });
  }

  findSmartContractIdByDappId(
    id: string,
    dappId: string,
  ): Promise<SmartContract> {
    console.log({ id, dappId });
    return getMongoRepository(SmartContract).findOne({
      where: {
        _id: new ObjectID(id),
        dappId: dappId,
      },
    });
  }

  saveSmartContract(smartContract: SmartContract): Promise<SmartContract> {
    return getMongoRepository(SmartContract).save(smartContract);
  }
}
