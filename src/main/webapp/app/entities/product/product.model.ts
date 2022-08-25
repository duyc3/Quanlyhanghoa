import dayjs from 'dayjs/esm';
import { IBillDetails } from 'app/entities/bill-details/bill-details.model';
import { IStore } from 'app/entities/store/store.model';

export interface IProduct {
  id?: number;
  nameProduct?: string;
  price?: number;
  createDate?: dayjs.Dayjs | null;
  createBy?: string | null;
  note?: string | null;
  billDetails?: IBillDetails[] | null;
  stores?: IStore[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public nameProduct?: string,
    public price?: number,
    public createDate?: dayjs.Dayjs | null,
    public createBy?: string | null,
    public note?: string | null,
    public billDetails?: IBillDetails[] | null,
    public stores?: IStore[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
