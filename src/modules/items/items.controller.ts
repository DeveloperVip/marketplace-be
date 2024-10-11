import { ItemService } from './items.service';
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ItemEntity } from "./domain/item.entity";

@Controller('items')
@ApiTags('Items')
export class ItemsController {
    constructor(
        private readonly ItemService: ItemService
    ){}

    @Get('/get-available-items')
    async getOpenItems(): Promise<ItemEntity[]>{
        return this.ItemService.getOpenItems()
    }

    @Get('/get-sold-items')
    async getSoldItems(): Promise<ItemEntity[]>{
        return this.ItemService.getSoldItems()
    }

    @Get('/get-all-items')
    async getAllItems(): Promise<ItemEntity[]>{
        return this.ItemService.getAllItems()
    }

    @Get('/get-items-sellerId/:seller')
    async getItemsByUserId(@Param('seller') seller:string): Promise<ItemEntity[]>{
        return this.ItemService.getItemsByUserId(seller)
    }

    @Get('/:itemId')
    async getItemById(@Param('itemId') itemId:string): Promise<ItemEntity>{
        return this.ItemService.getItemById(itemId)
    }
}