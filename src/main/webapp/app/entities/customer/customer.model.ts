import { IBill } from 'app/entities/bill/bill.model';

export interface ICustomer {
  id?: number;
  nameCustomer?: string;
  ageCustomer?: number;
  addressCustomer?: string;
  numberphoneCustomer?: number;
  bills?: IBill[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public nameCustomer?: string,
    public ageCustomer?: number,
    public addressCustomer?: string,
    public numberphoneCustomer?: number,
    public bills?: IBill[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
