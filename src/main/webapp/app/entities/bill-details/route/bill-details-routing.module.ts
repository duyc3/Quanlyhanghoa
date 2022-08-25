import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BillDetailsComponent } from '../list/bill-details.component';
import { BillDetailsDetailComponent } from '../detail/bill-details-detail.component';
import { BillDetailsUpdateComponent } from '../update/bill-details-update.component';
import { BillDetailsRoutingResolveService } from './bill-details-routing-resolve.service';

const billDetailsRoute: Routes = [
  {
    path: '',
    component: BillDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillDetailsDetailComponent,
    resolve: {
      billDetails: BillDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillDetailsUpdateComponent,
    resolve: {
      billDetails: BillDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillDetailsUpdateComponent,
    resolve: {
      billDetails: BillDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(billDetailsRoute)],
  exports: [RouterModule],
})
export class BillDetailsRoutingModule {}
