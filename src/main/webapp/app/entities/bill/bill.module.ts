import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BillComponent } from './list/bill.component';
import { BillDetailComponent } from './detail/bill-detail.component';
import { BillUpdateComponent } from './update/bill-update.component';
import { BillDeleteDialogComponent } from './delete/bill-delete-dialog.component';
import { BillRoutingModule } from './route/bill-routing.module';

@NgModule({
  imports: [SharedModule, BillRoutingModule],
  declarations: [BillComponent, BillDetailComponent, BillUpdateComponent, BillDeleteDialogComponent],
  entryComponents: [BillDeleteDialogComponent],
})
export class BillModule {}
