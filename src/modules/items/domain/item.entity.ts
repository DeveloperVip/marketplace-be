import { ApiTags } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Iitem } from "./item.model";
import { statusItem } from "../enum/item-status.enum";

@Entity("items")
export class ItemEntity extends BaseEntity implements Iitem{
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({name:'nft_id',nullable:false,type:'varchar'})
    tokenId: string;
    @Column({name:'seller', type: 'varchar'})
    seller: string;
    @Column({name:'owner_id',nullable:false,type:'uuid'})
    owner: string;
    @Column({nullable:false,type:'integer'})
    price: number;
    @Column({nullable:false,enum: statusItem, default:statusItem.AVAILABLE})
    sold: statusItem;  
    @Column({ name: 'created_at', nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @Column({ name: 'updated_at', nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;  
}

