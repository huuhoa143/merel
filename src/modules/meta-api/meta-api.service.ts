/* eslint-disable prefer-const */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMetaApiDto } from '@/modules/meta-api/dto/create-meta-api.dto';
import { MetaApiRepository } from '@/modules/meta-api/meta-api.repository';
import { MetaApi } from '@/modules/meta-api/entities/meta-api.entity';
import { SmartContractService } from '@/modules/smart-contract/smart-contract.service';

@Injectable()
export class MetaApiService {
  private readonly logger = new Logger(MetaApiService.name);

  constructor(
    private readonly metaApiRepository: MetaApiRepository,
    private readonly smartContractService: SmartContractService,
  ) {}

  async create(createMetaApiDto: CreateMetaApiDto) {
    const findApi = await this.findMetaApiByNameAndDappIdAndContractId(
      createMetaApiDto.name,
      createMetaApiDto.dappId,
      createMetaApiDto.smartContractId,
    );
    if (findApi) {
      throw new NotFoundException('META_API.META_API_ALREADY_EXISTED');
    }

    const smartContract = await this.smartContractService.findById(
      createMetaApiDto.smartContractId,
    );

    if (!smartContract) {
      throw new NotFoundException('SMART_CONTRACT.SMART_CONTRACT_NOT_FOUND');
    }
    const metaApi = new MetaApi();
    metaApi.name = createMetaApiDto.name;
    metaApi.apiType = createMetaApiDto.apiType;
    metaApi.smartContractId = createMetaApiDto.smartContractId;
    metaApi.dappId = createMetaApiDto.dappId;
    metaApi.methodType = createMetaApiDto.methodType;
    metaApi.method = createMetaApiDto.method;

    return this.metaApiRepository.saveMetaApi(metaApi);
  }

  async findMetaApiByNameAndDappIdAndContractId(
    name: string,
    dappId: string,
    smartContractId: string,
  ) {
    return this.metaApiRepository.findMetaApiByNameAndDappIdAndContractId(
      name,
      dappId,
      smartContractId,
    );
  }

  async findById(id: string) {
    return this.metaApiRepository.findOne(id);
  }
}
