import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBill } from '../bill.model';
import { BillService } from '../service/bill.service';

@Component({
  templateUrl: './bill-delete-dialog.component.html',
})
export class BillDeleteDialogComponent {
  bill?: IBill;

  constructor(protected billService: BillService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.billService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
