import { Module } from "@nestjs/common";
import { ItemService } from "./items.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ItemEntity } from "./domain/item.entity";
import { ItemsController } from "./items.controller";

@Module({
    imports:[TypeOrmModule.forFeature([ItemEntity])],
    controllers:[ItemsController],
    providers:[ItemService],
    exports:[ItemService]
})

export class ItemsModule {}