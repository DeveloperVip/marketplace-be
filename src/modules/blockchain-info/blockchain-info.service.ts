import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BlockchainInfoEntity } from './domain/blockchain-info.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlockchainInfoService {
  private readonly logger = new Logger(BlockchainInfoService.name);
  constructor(
    @InjectRepository(BlockchainInfoEntity)
    private readonly blockchainInfoRepository: Repository<BlockchainInfoEntity>,
  ) {}

  async getBlockchainInfo(name: string): Promise<BlockchainInfoEntity> {
    return this.blockchainInfoRepository.findOne({ where: { name } });
  }

  async getLastScanBlock(name: string, eventName: string): Promise<number> {
    const blockchainInfo = await this.blockchainInfoRepository.findOne({
      where: { name, eventName },
    });
    this.logger.log("block: ",blockchainInfo)
    return blockchainInfo.lastScanBlock;
  }

  async updateBlockchainInfo(
    name: string,
    eventName: string,
    lastScanBlock: number,
  ): Promise<BlockchainInfoEntity> {
    const blockchainInfo = await this.blockchainInfoRepository.findOne({
      where: { name, eventName },
    });
    blockchainInfo.lastScanBlock = lastScanBlock;
    return this.blockchainInfoRepository.save(blockchainInfo);
  }
}
