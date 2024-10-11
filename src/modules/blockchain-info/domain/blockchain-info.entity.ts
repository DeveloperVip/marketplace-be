import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IBlockchainInfoModel } from './blockchain-info.model';

@Entity('blockchain_info')
export class BlockchainInfoEntity
  extends BaseEntity
  implements IBlockchainInfoModel
{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false, type: 'integer', name: 'last_scan_block' })
  lastScanBlock: number;
  @Column({ nullable: false, type: 'varchar' })
  name: string;
  @Column({ nullable: false, type: 'varchar', name: 'event_name' })
  eventName: string;
  @Column({
    name: 'created_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    name: 'updated_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
