import { BlockchainInfoService } from './blockchain-info.service';
import { BlockchainInfoEntity } from './domain/blockchain-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlockchainInfoController } from './blockchain-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlockchainInfoEntity])],
  providers: [BlockchainInfoService],
  exports: [BlockchainInfoService],
  controllers: [BlockchainInfoController],
})
export class BlockchainInfoModule {}