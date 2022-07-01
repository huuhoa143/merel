import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { Dapp } from './entities/dapps.entity';

@EntityRepository(Dapp)
export class DappsRepository extends Repository<Dapp> {
  findByName(name: string): Promise<Dapp> {
    return getMongoRepository(Dapp).findOne({
      where: {
        name: name,
      },
    });
  }

  saveDapp(dapps: Dapp): Promise<Dapp> {
    return getMongoRepository(Dapp).save(dapps);
  }

  async getAllDapp(getDappFilter: any): Promise<[Dapp[], number]> {
    const { search, limit, page } = getDappFilter;
    const regex = new RegExp(search, 'i');

    return getMongoRepository(Dapp).findAndCount({
      where: {
        $and: [{ name: regex }],
      },
      take: limit,
      skip: (page - 1) * limit,
      order: { updatedAt: 'DESC' },
    });
  }
}
