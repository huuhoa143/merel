import {
  EntityRepository,
  FindAndModifyWriteOpResultObject,
  getMongoRepository,
  Repository,
} from 'typeorm';
import { Purses } from '@/modules/purse/entities/purse.entity';
import { ObjectID } from 'mongodb';

@EntityRepository(Purses)
export class PursesRepository extends Repository<Purses> {
  savePurses(purses: Purses): Promise<Purses> {
    return getMongoRepository(Purses).save(purses);
  }

  findAllPurseReady(): Promise<Purses[]> {
    return getMongoRepository(Purses).find({
      where: {
        ready: true,
      },
    });
  }

  findAndUpdatePurseProperty(
    id: string,
    update: any,
  ): Promise<FindAndModifyWriteOpResultObject> {
    return getMongoRepository(Purses).findOneAndUpdate(
      {
        _id: new ObjectID(id),
      },
      {
        $set: update,
      },
    );
  }
}
