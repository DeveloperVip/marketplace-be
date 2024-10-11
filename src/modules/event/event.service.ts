import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { environments } from 'src/environments/environments';
import { Web3 } from 'web3';
import { BlockchainInfoService } from '../blockchain-info/blockchain-info.service';
import { ItemService } from '../items/items.service';
import { NftService } from '../nft/nft.service';
import { UserServices } from '../users/users.service';

@Injectable()
export class eventOnchangeService {
  private readonly logger = new Logger(eventOnchangeService.name);
  private marketplaceContract: any;
  private web3: any;
  constructor(
    private readonly blockchainInfoService: BlockchainInfoService,
    private readonly itemsService: ItemService,
    private readonly nftService: NftService,
    private readonly usersService: UserServices,
  ) {
    this.web3 = new Web3(environments.onchainData.web3Provider);
    this.marketplaceContract = new this.web3.eth.Contract(
      environments.onchainData.marketplaceABI,
      environments.onchainData.marketplaceContractAddress,
    );
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async listenMarketItemCreatedEvent(): Promise<void> {
    try {
      const eventName = 'MarketItemCreated';
      const lastScanBlock = await this.blockchainInfoService.getLastScanBlock(
        environments.onchainData.blockchainName,
        eventName,
      );
      const currentBlock = await this.web3.eth.getBlockNumber();
      this.logger.log(
        'Scanning from block ' +
          (lastScanBlock + 1) +
          ' to block ' +
          currentBlock,
      );
      // this.logger.log('Processing ' + this.marketplaceContract.getPastEvents + ' Listed events');
      // const batchSize = 5; 
      // let toBlock =
      //   lastScanBlock + batchSize > currentBlock
      //     ? currentBlock
      //     : lastScanBlock + batchSize;
      const events = await this.marketplaceContract.getPastEvents(eventName, {
        fromBlock: lastScanBlock + 1,
        toBlock: currentBlock,
      });
      
      this.logger.log('Processing ' + events + ' Listed events');

      await this._processMarketItemCreatedMarketItemCreatedEvent(events);

      await this.blockchainInfoService.updateBlockchainInfo(
        environments.onchainData.blockchainName,
        eventName,
        currentBlock,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // public async listenSoldEvents() {
  //   const eventName = 'Sold';
  //   const lastScanBlock = await this.blockchainInfoService.getLastScanBlock(environments.onchainData.blockchainName, eventName);
  //   const currentBlock = await this.web3.eth.getBlockNumber();
  //   this.marketplaceContract.getPastEvents(eventName, {
  //     fromBlock: lastScanBlock + 1,
  //     toBlock: currentBlock
  //   }, (error: any, events: any) => {
  //     if (error) {
  //       this.logger.error(error);
  //     }
  //     this._processSoldEvent(events);
  //   });
  //   await this.blockchainInfoService.updateBlockchainInfo(environments.onchainData.blockchainName, eventName, currentBlock);
  // }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // public async listenCancelledEvents() {
  //   const eventName = 'Cancelled';
  //   const lastScanBlock = await this.blockchainInfoService.getLastScanBlock(environments.onchainData.blockchainName, eventName);
  //   const currentBlock = await this.web3.eth.getBlockNumber();
  //   this.marketplaceContract.getPastEvents(eventName, {
  //     fromBlock: lastScanBlock + 1,
  //     toBlock: currentBlock
  //   }, (error: any, events: any) => {
  //     if (error) {
  //       this.logger.error(error);
  //     }
  //     this._processCancelledEvent(events);
  //   });
  //   await this.blockchainInfoService.updateBlockchainInfo(environments.onchainData.blockchainName,eventName, currentBlock);
  // }

  private async _processMarketItemCreatedMarketItemCreatedEvent(events: any) {
    const eventAbi = environments.onchainData.marketplaceABI.find(
      (e: any) => {
        // this.logger.log('Processing ' + e.name + ' Listed events');
        return e.name === 'MarketItemCreated';
      }
    );
    const nftAddress = environments.onchainData.nftAddress;
    this.logger.log('Processing ' + events.length + ' Listed events');
    for (let i = 0; i < events.length; i++) {
      const log = events[i];
      const decoded = this.web3.eth.abi.decodeLog(
        eventAbi.inputs,
        log.data,
        log.topics.slice(1),
      );
      const itemData = {
        owner: await this.usersService.findOrCreateUser(decoded.owner),
        tokenId: await this.nftService.findOrCreateNft({
          address: nftAddress,
          nftId: decoded.tokenId,
        }),
        price: decoded.price,
        seller: decoded.seller,
      };
      await this.itemsService.createItems(itemData);
    }
  }

  // private async _processSoldEvent(event: any) {
  // }

  // private async _processCancelledEvent(event: any) {
  // }
}
