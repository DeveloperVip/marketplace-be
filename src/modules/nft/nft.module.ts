import { Module } from "@nestjs/common";
import { NftEntity } from "./domain/nft.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NftService } from "./nft.service";
import { NftController } from "./nft.controller";

@Module({
    imports: [TypeOrmModule.forFeature([NftEntity])],
    providers: [NftService],
    controllers: [NftController],
    exports: [NftService],
})
export class NftModule {}