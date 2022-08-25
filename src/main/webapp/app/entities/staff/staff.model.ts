import { IBill } from 'app/entities/bill/bill.model';

export interface IStaff {
  id?: number;
  nameStaff?: string;
  ageStaff?: number;
  addressStaff?: string;
  numberphoneStaff?: number;
  bills?: IBill[] | null;
}

export class Staff implements IStaff {
  constructor(
    public id?: number,
    public nameStaff?: string,
    public ageStaff?: number,
    public addressStaff?: string,
    public numberphoneStaff?: number,
    public bills?: IBill[] | null
  ) {}
}

export function getStaffIdentifier(staff: IStaff): number | undefined {
  return staff.id;
}
