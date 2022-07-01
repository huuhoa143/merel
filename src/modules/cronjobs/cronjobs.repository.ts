import {
  EntityRepository,
  getMongoRepository,
  Repository,
  UpdateWriteOpResult,
} from 'typeorm';
import { Cronjob } from './entities/cronjob.entity';

@EntityRepository(Cronjob)
export class CronjobRepository extends Repository<Cronjob> {
  findBy(taskName: Array<string>): Promise<Cronjob[]> {
    return getMongoRepository(Cronjob).find({
      where: { taskName: { $or: taskName } },
    });
  }

  updateRunning(
    taskName: Array<string>,
    running: boolean,
  ): Promise<UpdateWriteOpResult> {
    return getMongoRepository(Cronjob).updateMany(
      { taskName: { $in: taskName } },
      { $set: { isRunning: running } },
    );
  }
}
