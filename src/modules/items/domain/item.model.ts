import { statusItem } from '../enum/item-status.enum';

export interface Iitem {
  id: string;
  tokenId: string;
  seller:string;
  owner: string;
  price: number;
  sold: statusItem;
  createdAt: Date;
  updatedAt: Date;
}
