import dayjs from 'dayjs/esm';
import { IProduct } from 'app/entities/product/product.model';

export interface IStore {
  id?: number;
  nameStore?: string;
  addressStore?: string;
  createDate?: dayjs.Dayjs | null;
  createBy?: string | null;
  products?: IProduct[] | null;
}

export class Store implements IStore {
  constructor(
    public id?: number,
    public nameStore?: string,
    public addressStore?: string,
    public createDate?: dayjs.Dayjs | null,
    public createBy?: string | null,
    public products?: IProduct[] | null
  ) {}
}

export function getStoreIdentifier(store: IStore): number | undefined {
  return store.id;
}
