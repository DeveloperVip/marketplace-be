import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { environments } from 'src/environments/environments';
import { Web3 } from 'web3';
import { BlockchainInfoService } from '../blockchain-info/blockchain-info.service';
import { ItemService } from '../items/items.service';
import { NftService } from '../nft/nft.service';
import { UserServices } from '../users/users.service';
import { isDefined } from 'class-validator';
import { NftEntity } from '../nft/domain/nft.entity';

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
      // const contractAddress = this.marketplaceContract;
      // this.logger.log('Marketplace Contract Address:', contractAddress);
      const eventName = 'MarketItemCreated';
      const lastScanBlock = await this.blockchainInfoService.getLastScanBlock(
        environments.onchainData.blockchainName,
        eventName,
      );
      const currentBlock = await this.web3.eth.getBlockNumber();
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

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async listenCreateNftEvents() {
    try {
      const eventName = 'MetadataUpdate'; // Sự kiện MetadataUpdate mà bạn đang lắng nghe
      const lastScanBlock = await this.blockchainInfoService.getLastScanBlock(
        environments.onchainData.blockchainName,
        eventName,
      );
      const currentBlock = await this.web3.eth.getBlockNumber();

      // Lấy các sự kiện từ lastScanBlock đến currentBlock
      this.marketplaceContract.getPastEvents(
        eventName,
        {
          fromBlock: lastScanBlock + 1,
          toBlock: currentBlock,
        },
        async (error: any, events: any) => {
          if (error) {
            this.logger.error('Error fetching events:', error);
            return;
          }

          // Xử lý các sự kiện nhận được
          await this._processCreateNftEvent(events);
        },
      );

      // Cập nhật block mới nhất vào cơ sở dữ liệu sau khi quét sự kiện
      await this.blockchainInfoService.updateBlockchainInfo(
        environments.onchainData.blockchainName,
        eventName,
        currentBlock,
      );
    } catch (err) {
      this.logger.error('Error in listenCreateNftEvents:', err);
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async listenTransferEvents() {
    try {
      const eventName = 'Transfer';
      const lastScanBlock = await this.blockchainInfoService.getLastScanBlock(
        environments.onchainData.blockchainName,
        eventName,
      );
      const currentBlock = await this.web3.eth.getBlockNumber();
      this.logger.log(currentBlock)
      // Lấy các sự kiện Transfer từ lastScanBlock đến currentBlock
      const event  = await this.marketplaceContract.getPastEvents(
        eventName,
        {
          fromBlock: lastScanBlock + 1,
          toBlock: currentBlock,
        }
      );
      this.logger.log("evnet",event)
       await this._processTransferEvent(event);
      // Cập nhật block mới nhất vào cơ sở dữ liệu sau khi quét sự kiện
      await this.blockchainInfoService.updateBlockchainInfo(
        environments.onchainData.blockchainName,
        eventName,
        currentBlock,
      );
    } catch (err) {
      this.logger.error('Error in listenTransferEvents:', err);
    }
  }

  private async _processMarketItemCreatedMarketItemCreatedEvent(events: any) {
    const eventAbi = environments.onchainData.marketplaceABI.find((e: any) => {
      return e.name === 'MarketItemCreated';
    });
    if (isDefined(eventAbi)) {
      const nftAddress = environments.onchainData.nftAddress;
      this.logger.log('Processing ' + events.length + ' Listed events');
      for (let i = 0; i < events.length; i++) {
        const log = events[i];
        const decoded = this.web3.eth.abi.decodeLog(
          eventAbi.inputs,
          log.data,
          log.topics.slice(1),
        );
        const ownerId = await this.usersService.findOrCreateUser(decoded.owner);
        const itemData = {
          owner: ownerId,
          seller: '0x0000000000000000000000000000000000000000',
          tokenId: decoded.tokenId,
          price: decoded.price,
        };
        await this.itemsService.createItems(itemData);
      }
    }
  }
  private async _processCreateNftEvent(events: any) {
    if (!events || events.length === 0) {
      this.logger.log('No new events found');
      return;
    }

    // Xử lý từng sự kiện MetadataUpdate
    for (const event of events) {
      const tokenId = event.returnValues.tokenId;

      this.logger.log(`Processing MetadataUpdate event: tokenId=${tokenId}`);

      // Gọi hàm để lấy tokenURI từ hợp đồng thông minh dựa trên tokenId
      const tokenURI = await this.getTokenURI(tokenId);
      this.logger.log(`Token URI for tokenId ${tokenId}: ${tokenURI}`);

      // Thêm logic lưu sự kiện vào cơ sở dữ liệu
      const nftData = {
        nftId: tokenId,
        uri: tokenURI,
        owner: event.returnValues.owner, // Giả sử sự kiện có chứa thông tin owner
        address: this.marketplaceContract.options.address,
      };

      await this.nftService.findOrCreateNft(nftData);
    }
  }

  private async getTokenURI(tokenId: number): Promise<string> {
    try {
      const tokenURI = await this.marketplaceContract.methods
        .tokenURI(tokenId)
        .call();
      return tokenURI;
    } catch (error) {
      this.logger.error(
        `Error fetching tokenURI for tokenId ${tokenId}:`,
        error,
      );
      throw error;
    }
  }

  private async _processTransferEvent(events: any) {
    if (!events || events.length === 0) {
      this.logger.log('No new events found');
      return;
    }

    for (const event of events) {
      const { tokenId, to } = event.returnValues;

      this.logger.log(
        `Processing Transfer event: tokenId=${tokenId}, new owner=${to}`,
      );

      // Gọi API updateOwner để cập nhật chủ sở hữu mới
      await this.nftService.updateOwner(tokenId, to);
    }
  }
}
