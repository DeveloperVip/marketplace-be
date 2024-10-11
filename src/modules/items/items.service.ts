import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './domain/item.entity';
import { Repository } from 'typeorm';
import { CreateItemDTO } from './dto/create-item.dto';
import { statusItem } from './enum/item-status.enum';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemsRepository : Repository<ItemEntity>,
  ) {}

  public async createItems(itemData: CreateItemDTO): Promise<void> {
    await this.itemsRepository.save({
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async getItemById(itemId: string): Promise<ItemEntity>{
    return this.itemsRepository.findOne({
      where: {id: itemId}
    })
  }

  public async getOpenItems(): Promise<ItemEntity[]>{
    return this.itemsRepository.find({
      where: {sold: statusItem.AVAILABLE}
    })
  }

  public async getSoldItems(): Promise<ItemEntity[]>{
    return this.itemsRepository.find({
      where: {sold: statusItem.SOLD}
    })
  }

  public async getItemsByUserId(seller: string): Promise<ItemEntity[]>{
    return this.itemsRepository.find({
      where: {seller}
    })
  }

  public async getAllItems(): Promise<ItemEntity[]>{
    return this.itemsRepository.find()
  }
}
