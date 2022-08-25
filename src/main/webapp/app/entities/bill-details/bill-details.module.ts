import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BillDetailsComponent } from './list/bill-details.component';
import { BillDetailsDetailComponent } from './detail/bill-details-detail.component';
import { BillDetailsUpdateComponent } from './update/bill-details-update.component';
import { BillDetailsDeleteDialogComponent } from './delete/bill-details-delete-dialog.component';
import { BillDetailsRoutingModule } from './route/bill-details-routing.module';

@NgModule({
  imports: [SharedModule, BillDetailsRoutingModule],
  declarations: [BillDetailsComponent, BillDetailsDetailComponent, BillDetailsUpdateComponent, BillDetailsDeleteDialogComponent],
  entryComponents: [BillDetailsDeleteDialogComponent],
})
export class BillDetailsModule {}
