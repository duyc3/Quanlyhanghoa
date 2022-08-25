import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBillDetails, BillDetails } from '../bill-details.model';
import { BillDetailsService } from '../service/bill-details.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IBill } from 'app/entities/bill/bill.model';
import { BillService } from 'app/entities/bill/service/bill.service';

@Component({
  selector: 'jhi-bill-details-update',
  templateUrl: './bill-details-update.component.html',
})
export class BillDetailsUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  billsSharedCollection: IBill[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [null, [Validators.required]],
    type: [null, [Validators.required]],
    createDate: [],
    createBy: [],
    product: [],
    bill: [],
  });

  constructor(
    protected billDetailsService: BillDetailsService,
    protected productService: ProductService,
    protected billService: BillService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billDetails }) => {
      this.updateForm(billDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const billDetails = this.createFromForm();
    if (billDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.billDetailsService.update(billDetails));
    } else {
      this.subscribeToSaveResponse(this.billDetailsService.create(billDetails));
    }
  }

  trackProductById(_index: number, item: IProduct): number {
    return item.id!;
  }

  trackBillById(_index: number, item: IBill): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBillDetails>>): void {
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

  protected updateForm(billDetails: IBillDetails): void {
    this.editForm.patchValue({
      id: billDetails.id,
      amount: billDetails.amount,
      type: billDetails.type,
      createDate: billDetails.createDate,
      createBy: billDetails.createBy,
      product: billDetails.product,
      bill: billDetails.bill,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(this.productsSharedCollection, billDetails.product);
    this.billsSharedCollection = this.billService.addBillToCollectionIfMissing(this.billsSharedCollection, billDetails.bill);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.billService
      .query()
      .pipe(map((res: HttpResponse<IBill[]>) => res.body ?? []))
      .pipe(map((bills: IBill[]) => this.billService.addBillToCollectionIfMissing(bills, this.editForm.get('bill')!.value)))
      .subscribe((bills: IBill[]) => (this.billsSharedCollection = bills));
  }

  protected createFromForm(): IBillDetails {
    return {
      ...new BillDetails(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      type: this.editForm.get(['type'])!.value,
      createDate: this.editForm.get(['createDate'])!.value,
      createBy: this.editForm.get(['createBy'])!.value,
      product: this.editForm.get(['product'])!.value,
      bill: this.editForm.get(['bill'])!.value,
    };
  }
}
