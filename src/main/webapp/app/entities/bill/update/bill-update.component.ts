import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBill, Bill } from '../bill.model';
import { BillService } from '../service/bill.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IStaff } from 'app/entities/staff/staff.model';
import { StaffService } from 'app/entities/staff/service/staff.service';

@Component({
  selector: 'jhi-bill-update',
  templateUrl: './bill-update.component.html',
})
export class BillUpdateComponent implements OnInit {
  isSaving = false;

  customersSharedCollection: ICustomer[] = [];
  staffSharedCollection: IStaff[] = [];

  editForm = this.fb.group({
    id: [],
    createDate: [],
    createBy: [],
    customer: [],
    staff: [],
  });

  constructor(
    protected billService: BillService,
    protected customerService: CustomerService,
    protected staffService: StaffService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bill }) => {
      this.updateForm(bill);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bill = this.createFromForm();
    if (bill.id !== undefined) {
      this.subscribeToSaveResponse(this.billService.update(bill));
    } else {
      this.subscribeToSaveResponse(this.billService.create(bill));
    }
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  trackStaffById(_index: number, item: IStaff): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBill>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bill: IBill): void {
    this.editForm.patchValue({
      id: bill.id,
      createDate: bill.createDate,
      createBy: bill.createBy,
      customer: bill.customer,
      staff: bill.staff,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(this.customersSharedCollection, bill.customer);
    this.staffSharedCollection = this.staffService.addStaffToCollectionIfMissing(this.staffSharedCollection, bill.staff);
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));

    this.staffService
      .query()
      .pipe(map((res: HttpResponse<IStaff[]>) => res.body ?? []))
      .pipe(map((staff: IStaff[]) => this.staffService.addStaffToCollectionIfMissing(staff, this.editForm.get('staff')!.value)))
      .subscribe((staff: IStaff[]) => (this.staffSharedCollection = staff));
  }

  protected createFromForm(): IBill {
    return {
      ...new Bill(),
      id: this.editForm.get(['id'])!.value,
      createDate: this.editForm.get(['createDate'])!.value,
      createBy: this.editForm.get(['createBy'])!.value,
      customer: this.editForm.get(['customer'])!.value,
      staff: this.editForm.get(['staff'])!.value,
    };
  }
}
