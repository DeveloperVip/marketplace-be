import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockchainInfoService } from './blockchain-info.service';
import { BlockchainInfoEntity } from './domain/blockchain-info.entity';

@Controller('blockchain-info')
@ApiTags('blockchain-info')
export class BlockchainInfoController {
  constructor(private readonly blockchainInfoService: BlockchainInfoService) {}

  @Get()
  async getBlockchainInfo(): Promise<BlockchainInfoEntity> {
    return this.blockchainInfoService.getBlockchainInfo('bsc');
  }
}