import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { SessionEntity } from '@/modules/sessions/entities/session.entity';
import { sub } from 'date-fns';
import { DEFAULT_SESSION_EXPIRE_DAY } from './constants/sessions.constant';
import { ObjectID } from 'mongodb';

@EntityRepository(SessionEntity)
export class SessionsRepository extends Repository<SessionEntity> {
  findBySessionId(sessionId: string): Promise<SessionEntity> {
    const sessionExpireDay =
      process.env.SESSION_EXPIRE_DAY || DEFAULT_SESSION_EXPIRE_DAY;
    return getMongoRepository(SessionEntity).findOne({
      where: {
        sessionId,
        createdAt: {
          $gt: new Date(
            sub(new Date(), { days: parseInt(sessionExpireDay, 10) }),
          ),
        },
      },
    });
  }

  createSession(session: SessionEntity): Promise<SessionEntity> {
    return getMongoRepository(SessionEntity).save(session);
  }

  deleteSession(sessionId: string) {
    return getMongoRepository(SessionEntity).findOneAndDelete({ sessionId });
  }

  deleteSessionsByMerchantId(merchantId: string) {
    return getMongoRepository(SessionEntity).deleteMany({
      merchant: new ObjectID(merchantId),
    });
  }
}
