import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { INft } from "./nft.model";

export class NftEntity extends BaseEntity implements INft{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:false,type:"varchar"})
    address: string;
    @Column({name:"nft_id",nullable:false,type:"integer"})
    nftId: number;
    @Column({nullable:false,type:"varchar"})
    owner: string;
    @Column({ name: 'created_at', nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ name: 'updated_at', nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}