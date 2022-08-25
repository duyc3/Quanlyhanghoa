import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBillDetails } from '../bill-details.model';
import { BillDetailsService } from '../service/bill-details.service';
import { BillDetailsDeleteDialogComponent } from '../delete/bill-details-delete-dialog.component';

@Component({
  selector: 'jhi-bill-details',
  templateUrl: './bill-details.component.html',
})
export class BillDetailsComponent implements OnInit {
  billDetails?: IBillDetails[];
  isLoading = false;

  constructor(protected billDetailsService: BillDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.billDetailsService.query().subscribe({
      next: (res: HttpResponse<IBillDetails[]>) => {
        this.isLoading = false;
        this.billDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IBillDetails): number {
    return item.id!;
  }

  delete(billDetails: IBillDetails): void {
    const modalRef = this.modalService.open(BillDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.billDetails = billDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
