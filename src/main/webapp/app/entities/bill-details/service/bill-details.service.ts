import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBillDetails, getBillDetailsIdentifier } from '../bill-details.model';

export type EntityResponseType = HttpResponse<IBillDetails>;
export type EntityArrayResponseType = HttpResponse<IBillDetails[]>;

@Injectable({ providedIn: 'root' })
export class BillDetailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bill-details');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(billDetails: IBillDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billDetails);
    return this.http
      .post<IBillDetails>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(billDetails: IBillDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billDetails);
    return this.http
      .put<IBillDetails>(`${this.resourceUrl}/${getBillDetailsIdentifier(billDetails) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(billDetails: IBillDetails): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(billDetails);
    return this.http
      .patch<IBillDetails>(`${this.resourceUrl}/${getBillDetailsIdentifier(billDetails) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBillDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBillDetails[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBillDetailsToCollectionIfMissing(
    billDetailsCollection: IBillDetails[],
    ...billDetailsToCheck: (IBillDetails | null | undefined)[]
  ): IBillDetails[] {
    const billDetails: IBillDetails[] = billDetailsToCheck.filter(isPresent);
    if (billDetails.length > 0) {
      const billDetailsCollectionIdentifiers = billDetailsCollection.map(billDetailsItem => getBillDetailsIdentifier(billDetailsItem)!);
      const billDetailsToAdd = billDetails.filter(billDetailsItem => {
        const billDetailsIdentifier = getBillDetailsIdentifier(billDetailsItem);
        if (billDetailsIdentifier == null || billDetailsCollectionIdentifiers.includes(billDetailsIdentifier)) {
          return false;
        }
        billDetailsCollectionIdentifiers.push(billDetailsIdentifier);
        return true;
      });
      return [...billDetailsToAdd, ...billDetailsCollection];
    }
    return billDetailsCollection;
  }

  protected convertDateFromClient(billDetails: IBillDetails): IBillDetails {
    return Object.assign({}, billDetails, {
      createDate: billDetails.createDate?.isValid() ? billDetails.createDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((billDetails: IBillDetails) => {
        billDetails.createDate = billDetails.createDate ? dayjs(billDetails.createDate) : undefined;
      });
    }
    return res;
  }
}
