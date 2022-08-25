import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBill } from '../bill.model';
import { BillService } from '../service/bill.service';
import { BillDeleteDialogComponent } from '../delete/bill-delete-dialog.component';

@Component({
  selector: 'jhi-bill',
  templateUrl: './bill.component.html',
})
export class BillComponent implements OnInit {
  bills?: IBill[];
  isLoading = false;

  constructor(protected billService: BillService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.billService.query().subscribe({
      next: (res: HttpResponse<IBill[]>) => {
        this.isLoading = false;
        this.bills = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IBill): number {
    return item.id!;
  }

  delete(bill: IBill): void {
    const modalRef = this.modalService.open(BillDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bill = bill;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
