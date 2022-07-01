/* eslint-disable prefer-const */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DappsRepository } from '@/modules/dapps/dapps.repository';
import { User } from '@/modules/users/entities/users.entity';
import { CreateDappDto } from '@/modules/dapps/dto/create-dapp.dto';
import { Dapp } from '@/modules/dapps/entities/dapps.entity';
import { GetAllDappFilterDto } from '@/modules/dapps/dto/get-all-dapp-filter.dto';
import { generateMnemonic } from 'bip39';
import { SettingsService } from '@/modules/settings/settings.service';
import { PurseService } from '@/modules/purse/purse.service';
import { DEFAULT_CHILDREN } from '@/common/constants/defaults';
import { UpdateDefaultConfigDto } from '@/modules/dapps/dto/update-default-config.dto';
import { PurseConfig } from '@/modules/purse/entities/purse.entity';
import BN from 'bignumber.js';
import { AddNewChildDto } from '@/modules/dapps/dto/add-new-child.dto';

@Injectable()
export class DappsService {
  private readonly logger = new Logger(DappsService.name);

  constructor(
    private readonly dappsRepository: DappsRepository,
    private readonly settingsService: SettingsService,
    private readonly purseService: PurseService,
  ) {}

  async create(createDappDto: CreateDappDto, user: User) {
    const findDapp = await this.findDappByNameAndUserId(
      createDappDto.name,
      user.id,
    );
    if (findDapp) {
      throw new NotFoundException('DAPP.DAPP_ALREADY_REGISTERED');
    }
    const dappEntity = new Dapp();
    dappEntity.name = createDappDto.name;
    dappEntity.networkId = createDappDto.networkId;
    dappEntity.userId = user.id.toString();

    const mnemonic = generateMnemonic();

    const purse = await this.purseService.create(
      dappEntity.networkId,
      mnemonic,
      DEFAULT_CHILDREN,
      true,
    );
    dappEntity.purse = purse.id.toString();

    await this.dappsRepository.saveDapp(dappEntity);
    return;
  }

  async getAllDapp(getAllDappFilterDto: GetAllDappFilterDto) {
    const [data, total] = await this.dappsRepository.getAllDapp(
      getAllDappFilterDto,
    );

    return { items: data, total: total };
  }

  async findDappByNameAndUserId(name: string, userId: string) {
    return await this.dappsRepository.findOne({
      where: { name, userId },
    });
  }

  async findDappById(id: string) {
    return await this.dappsRepository.findOne(id);
  }

  async updateDefaultConfig(updateDefaultConfigDto: UpdateDefaultConfigDto) {
    const { dappId, masterWalletThreshold, minChildBalance, baseFundValue } =
      updateDefaultConfigDto;
    const dapp = await this.findDappById(dappId);
    if (!dapp) {
      throw new NotFoundException('DAPP.DAPP_NOT_FOUND');
    }
    const purse = await this.purseService.findPurse(dapp.purse);
    const fromWei = new BN(10).pow(new BN(18));
    if (new BN(baseFundValue).gt(new BN(masterWalletThreshold))) {
      throw new BadRequestException('DAPP.BASE_FUND_VALUE_TOO_HIGH');
    }

    if (new BN(minChildBalance).gt(new BN(masterWalletThreshold))) {
      throw new BadRequestException('DAPP.MIN_CHILD_BALANCE_TOO_HIGH');
    }
    let config: PurseConfig = {
      baseFundValue: baseFundValue
        ? new BN(baseFundValue).multipliedBy(fromWei).toFixed()
        : purse.config.baseFundValue,
      minChildBalance: minChildBalance
        ? new BN(minChildBalance).multipliedBy(fromWei).toFixed()
        : purse.config.minChildBalance,
      masterWalletThreshold: masterWalletThreshold
        ? new BN(masterWalletThreshold).multipliedBy(fromWei).toFixed()
        : purse.config.masterWalletThreshold,
    };

    await this.purseService.updateConfig(purse, config);
    return;
  }

  async addNewChild(addNewChildDto: AddNewChildDto) {
    const { dappId, numberOfChildren } = addNewChildDto;
    const dapp = await this.findDappById(dappId);
    if (!dapp) {
      throw new NotFoundException('DAPP.DAPP_NOT_FOUND');
    }
    const purse = await this.purseService.findPurse(dapp.purse);
    return await this.purseService.createNewChild(purse, numberOfChildren);
  }
}
