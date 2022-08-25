import dayjs from 'dayjs/esm';
import { IBillDetails } from 'app/entities/bill-details/bill-details.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IStaff } from 'app/entities/staff/staff.model';

export interface IBill {
  id?: number;
  createDate?: dayjs.Dayjs | null;
  createBy?: string | null;
  billDetails?: IBillDetails[] | null;
  customer?: ICustomer | null;
  staff?: IStaff | null;
}

export class Bill implements IBill {
  constructor(
    public id?: number,
    public createDate?: dayjs.Dayjs | null,
    public createBy?: string | null,
    public billDetails?: IBillDetails[] | null,
    public customer?: ICustomer | null,
    public staff?: IStaff | null
  ) {}
}

export function getBillIdentifier(bill: IBill): number | undefined {
  return bill.id;
}
