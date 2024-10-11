import { Repository } from "typeorm";
import { NftSaleHistoryEntity } from "./domain/nft-sale-history.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateNftSaleHistoryDto } from "./dto/create-nft-sale-history.dto";

export class NftSaleHistoryService {
  constructor(
    @InjectRepository(NftSaleHistoryEntity)
    private readonly nftSaleHistoryRepository: Repository<NftSaleHistoryEntity>,
  ) {
  }

  public async getNftSaleHistoryForItem(itemId: number): Promise<NftSaleHistoryEntity[]> {
    return this.nftSaleHistoryRepository.find({
      where: { itemId },
    });
  }

  public async createNftSaleHistory(nftSaleHistoryData: CreateNftSaleHistoryDto): Promise<void> {
    await this.nftSaleHistoryRepository.save({
      ...nftSaleHistoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}