import dayjs from 'dayjs/esm';
import { IProduct } from 'app/entities/product/product.model';
import { IBill } from 'app/entities/bill/bill.model';

export interface IBillDetails {
  id?: number;
  amount?: number;
  type?: string;
  createDate?: dayjs.Dayjs | null;
  createBy?: string | null;
  product?: IProduct | null;
  bill?: IBill | null;
}

export class BillDetails implements IBillDetails {
  constructor(
    public id?: number,
    public amount?: number,
    public type?: string,
    public createDate?: dayjs.Dayjs | null,
    public createBy?: string | null,
    public product?: IProduct | null,
    public bill?: IBill | null
  ) {}
}

export function getBillDetailsIdentifier(billDetails: IBillDetails): number | undefined {
  return billDetails.id;
}
