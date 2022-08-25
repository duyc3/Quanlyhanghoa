import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BillComponent } from '../list/bill.component';
import { BillDetailComponent } from '../detail/bill-detail.component';
import { BillUpdateComponent } from '../update/bill-update.component';
import { BillRoutingResolveService } from './bill-routing-resolve.service';

const billRoute: Routes = [
  {
    path: '',
    component: BillComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillDetailComponent,
    resolve: {
      bill: BillRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillUpdateComponent,
    resolve: {
      bill: BillRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillUpdateComponent,
    resolve: {
      bill: BillRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(billRoute)],
  exports: [RouterModule],
})
export class BillRoutingModule {}
