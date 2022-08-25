import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBillDetails } from '../bill-details.model';
import { BillDetailsService } from '../service/bill-details.service';

@Component({
  templateUrl: './bill-details-delete-dialog.component.html',
})
export class BillDetailsDeleteDialogComponent {
  billDetails?: IBillDetails;

  constructor(protected billDetailsService: BillDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.billDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
