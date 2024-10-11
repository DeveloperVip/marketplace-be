import { Module } from "@nestjs/common";
import { eventOnchangeService } from "./event.service";
import { BlockchainInfoModule } from "../blockchain-info/blockchain-info.module";
import { ItemsModule } from "../items/items.module";
import { UsersModule } from "../users/users.module";
import { NftModule } from "../nft/nft.module";

@Module({
    imports: [BlockchainInfoModule,ItemsModule,UsersModule,NftModule],
    controllers:[],
    providers:[eventOnchangeService],
    exports:[eventOnchangeService]
})
export class EventModule{}