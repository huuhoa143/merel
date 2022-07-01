import { EntityRepository, getMongoRepository, Repository } from 'typeorm';
import { User } from './entities/users.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User> {
    return getMongoRepository(User).findOne({
      where: {
        email: email,
      },
    });
  }

  saveUser(user: User): Promise<User> {
    return getMongoRepository(User).save(user);
  }

  findUser(id: string): Promise<User> {
    return getMongoRepository(User).findOne(id);
  }

  async getAllUser(getUserFilter: any): Promise<[User[], number]> {
    const { search, limit, page } = getUserFilter;
    const regex = new RegExp(search, 'i');

    return getMongoRepository(User).findAndCount({
      where: {
        $and: [{ email: regex }],
      },
      take: limit,
      skip: (page - 1) * limit,
      order: { updatedAt: 'DESC' },
    });
  }
}
