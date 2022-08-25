import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBill, getBillIdentifier } from '../bill.model';

export type EntityResponseType = HttpResponse<IBill>;
export type EntityArrayResponseType = HttpResponse<IBill[]>;

@Injectable({ providedIn: 'root' })
export class BillService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bills');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bill: IBill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bill);
    return this.http
      .post<IBill>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bill: IBill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bill);
    return this.http
      .put<IBill>(`${this.resourceUrl}/${getBillIdentifier(bill) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bill: IBill): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bill);
    return this.http
      .patch<IBill>(`${this.resourceUrl}/${getBillIdentifier(bill) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBill>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBill[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBillToCollectionIfMissing(billCollection: IBill[], ...billsToCheck: (IBill | null | undefined)[]): IBill[] {
    const bills: IBill[] = billsToCheck.filter(isPresent);
    if (bills.length > 0) {
      const billCollectionIdentifiers = billCollection.map(billItem => getBillIdentifier(billItem)!);
      const billsToAdd = bills.filter(billItem => {
        const billIdentifier = getBillIdentifier(billItem);
        if (billIdentifier == null || billCollectionIdentifiers.includes(billIdentifier)) {
          return false;
        }
        billCollectionIdentifiers.push(billIdentifier);
        return true;
      });
      return [...billsToAdd, ...billCollection];
    }
    return billCollection;
  }

  protected convertDateFromClient(bill: IBill): IBill {
    return Object.assign({}, bill, {
      createDate: bill.createDate?.isValid() ? bill.createDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createDate = res.body.createDate ? dayjs(res.body.createDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bill: IBill) => {
        bill.createDate = bill.createDate ? dayjs(bill.createDate) : undefined;
      });
    }
    return res;
  }
}
