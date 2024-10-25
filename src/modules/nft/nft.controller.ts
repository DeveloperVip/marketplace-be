import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { NftService } from "./nft.service";
import { NftEntity } from "./domain/nft.entity";

@Controller('nft')
@ApiTags('nft')
export class NftController {
  constructor(
    private readonly nftService: NftService,
  ) {}

  @Get('/all-nfts')
  public async getAllNfts(): Promise<any> {
    return await this.nftService.getAllNfts();
  }


  @Get('/nfts-by-owner/:owner')
  public async getNftsByOwner(@Param("owner") owner: string): Promise<NftEntity[]> {
    return this.nftService.getNftsByOwner(owner);
  }

  @Get('/get-nft/:nftId')
  public async getNftById(@Param("nftId") nftId: number): Promise<NftEntity> {
    return this.nftService.getNftById(nftId);
  }

  @Put('/update-owner/:nftId')
  public async updateOwner(@Param("nftId") nftId: number, @Body() owner: string): Promise<void> {
    return this.nftService.updateOwner(nftId, owner);
  }
}