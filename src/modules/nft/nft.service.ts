import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NftEntity } from './domain/nft.entity';
import { ILike, Repository } from 'typeorm';
import { isDefined } from 'class-validator';
import { CreateNftDto } from './dto/create-nft.dto';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);
  constructor(
    @InjectRepository(NftEntity)
    private readonly NftRepository: Repository<NftEntity>,
  ) {}

  public async getNftById(nft_id: number): Promise<NftEntity> {
    return this.NftRepository.findOne({ where: { nftId: nft_id } });
  }

  public async findOrCreateNft(nftData: CreateNftDto): Promise<string> {
    const nft: NftEntity = await this.NftRepository.findOne({
      where: { nftId: nftData.nftId, address: nftData.address },
    });
    if (!isDefined(nft)) {
      const newNft = await this.NftRepository.save({
        ...nftData,
        created_at: new Date(),
        updated_at: new Date(),
      });
      return newNft.id;
    }
    return nft.id;
  }

  public async getNftsByOwner(owner: string): Promise<NftEntity[]> {
    this.logger.log(owner);
    const nft = await this.NftRepository.find({
      where: { owner: ILike(`%${owner}%`) },
    });
    this.logger.log(nft);
    return nft;
  }

  public async getAllNfts(): Promise<NftEntity[]> {
    return this.NftRepository.find();
  }

  //update owner nếu bán được nft
  public async updateOwner(nftId: number, owner: string): Promise<void> {
    await this.NftRepository.update({ nftId }, { owner });
  }
}
