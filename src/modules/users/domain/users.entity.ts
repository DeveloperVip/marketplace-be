import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './users.model';

@Entity('user')
export class UserEntity extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true, name: 'address' })
  address: string;

  @Column({
    type: 'timestamp',
    name: 'create_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_at: Date;

  @Column({
    type: 'timestamp',
    name: 'update_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  update_at: Date;
}
