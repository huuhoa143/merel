import { User } from './entities/users.entity';
/* eslint-disable prefer-const */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from '@/common/utility/hash.utility';
import { UserRepository } from '@/modules/users/users.repository';
import { GetAllUserFilterDto } from '@/modules/users/dto/get-all-user-filter.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto) {
    const checkUser = await this.findByEmail(createUserDto.email);
    if (checkUser) {
      throw new NotFoundException('MERCHANT.MERCHANT_ALREADY_REGISTERED');
    }

    const userEntity = new User();
    userEntity.email = createUserDto.email;
    userEntity.password = await hashPassword(createUserDto.password);
    userEntity.name = createUserDto.name;
    await this.userRepository.saveUser(userEntity);
  }

  async getAllUser(getAllUserFilterDto: GetAllUserFilterDto) {
    const [data, total] = await this.userRepository.getAllUser(
      getAllUserFilterDto,
    );

    return { items: data, total: total };
  }

  async update(user: User) {
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findById(id: string) {
    return await this.userRepository.findOne(id);
  }

  async getMyInfo(id: string) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('USER.USER_NOT_FOUND');
    } else {
      return user;
    }
  }

  // async setUpWallet(user: User, setupWalletDto: SetupWalletDto) {
  //   const findUser = await this.userRepository.findOne(user.id);
  //   if (!findUser) {
  //     throw new NotFoundException('USER.USER_NOT_FOUND');
  //   }
  //
  //   for (const wallet of setupWalletDto.wallets) {
  //     if (
  //       findUser.wallets.length === 0 ||
  //       !findUser.wallets.find((w) => w.networkId === wallet.networkId)
  //     ) {
  //       const provider = await this.settingsService.getNetworkProvider(
  //         wallet.networkId,
  //       );
  //
  //       const account = createNewWallet(provider, findUser.password);
  //       findUser.wallets.push({
  //         networkId: wallet.networkId,
  //         network: wallet.network,
  //         address: account.address,
  //         privateKey: encryptPrivateKey(account.privateKey),
  //       });
  //     }
  //   }
  //   await this.update(findUser);
  // }
}
