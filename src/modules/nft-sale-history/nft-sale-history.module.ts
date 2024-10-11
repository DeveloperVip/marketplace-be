import { NftSaleHistoryEntity } from "./domain/nft-sale-history.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { NftSaleHistoryService } from "./nft-sale-history.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([NftSaleHistoryEntity]),
    ],
    controllers: [],
    providers: [NftSaleHistoryService],
    exports: [NftSaleHistoryService],
})
export class NftSaleHistoryModule {
}