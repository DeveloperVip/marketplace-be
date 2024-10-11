import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { INftSaleHistory } from "./nft-sale-history.model";

@Entity({ name: 'nft_sale_history' })
export class NftSaleHistoryEntity extends BaseEntity implements INftSaleHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({name: 'item_id', nullable: false, type: 'integer'})
  itemId: number;
  @Column({nullable: false, type: 'integer'})
  price: number;
  @Column({nullable: false, type: 'varchar'})
  buyer: string;
  @Column({nullable: false, type: 'varchar'})
  seller: string;
  @Column({ name: 'created_at', nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ name: 'updated_at', nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}