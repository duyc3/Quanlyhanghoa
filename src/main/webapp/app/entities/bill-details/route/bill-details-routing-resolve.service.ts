import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBillDetails, BillDetails } from '../bill-details.model';
import { BillDetailsService } from '../service/bill-details.service';

@Injectable({ providedIn: 'root' })
export class BillDetailsRoutingResolveService implements Resolve<IBillDetails> {
  constructor(protected service: BillDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billDetails: HttpResponse<BillDetails>) => {
          if (billDetails.body) {
            return of(billDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BillDetails());
  }
}
