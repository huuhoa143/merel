/* eslint-disable prefer-const */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSmartContractDto } from '@/modules/smart-contract/dto/create-smart-contract.dto';
import { SmartContractRepository } from '@/modules/smart-contract/smart-contract.repository';
import { SmartContract } from '@/modules/smart-contract/entities/smart-contract.entity';
import { Contract } from 'web3-eth-contract';

@Injectable()
export class SmartContractService {
  async;
  private readonly logger = new Logger(SmartContractService.name);

  constructor(
    private readonly smartContractRepository: SmartContractRepository,
  ) {}

  async create(createSmartContractDto: CreateSmartContractDto) {
    const findSmartContract = await this.findSmartContractByNameAndDappId(
      createSmartContractDto.name,
      createSmartContractDto.dappId,
    );
    if (findSmartContract) {
      throw new NotFoundException(
        'SMART_CONTRACT.SMART_CONTRACT_ALREADY_EXISTED',
      );
    }
    const smartContract = new SmartContract();
    smartContract.name = createSmartContractDto.name;
    smartContract.dappId = createSmartContractDto.dappId;
    smartContract.type = createSmartContractDto.type;
    smartContract.abi = createSmartContractDto.abi;
    smartContract.address = createSmartContractDto.address;
    smartContract.metaTransactionType =
      createSmartContractDto.metaTransactionType;

    return this.smartContractRepository.saveSmartContract(smartContract);
  }

  async findSmartContractByNameAndDappId(name: string, dappId: string) {
    return this.smartContractRepository.findSmartContractByNameAndDappId(
      name,
      dappId,
    );
  }

  async findById(id: string) {
    return this.smartContractRepository.findOne(id);
  }

  async findByIdAndDappId(id: string, dappId: string) {
    return this.smartContractRepository.findSmartContractIdByDappId(id, dappId);
  }

  getInputParams(abi: Array<any>, method: string) {
    const methodAbi = abi.find((item: any) => item.name === method);
    if (!methodAbi) {
      throw new Error('SMART_CONTRACT.METHOD_NOT_FOUND');
    }
    return methodAbi.inputs;
  }

  validateParams(abi: Array<any>, params: any, method: string) {
    const functionParams = abi.find((item: any) => item.name === method);
    if (!functionParams) {
      throw new Error('SMART_CONTRACT.METHOD_NOT_FOUND');
    }
    const inputParams = this.getInputParams(abi, method);
    if (inputParams.length !== params.length) {
      throw new Error('SMART_CONTRACT.INVALID_PARAMS');
    }
    return true;
  }

  async getFunctionSignature(
    contractInstance: Contract,
    method: string,
    params: Array<any>,
  ) {
    return contractInstance.methods[method](...params).encodeABI();
  }
}
