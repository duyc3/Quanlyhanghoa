import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBillDetails, BillDetails } from '../bill-details.model';

import { BillDetailsService } from './bill-details.service';

describe('BillDetails Service', () => {
  let service: BillDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IBillDetails;
  let expectedResult: IBillDetails | IBillDetails[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BillDetailsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      amount: 0,
      type: 'AAAAAAA',
      createDate: currentDate,
      createBy: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a BillDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createDate: currentDate,
        },
        returnedFromService
      );

      service.create(new BillDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BillDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amount: 1,
          type: 'BBBBBB',
          createDate: currentDate.format(DATE_FORMAT),
          createBy: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BillDetails', () => {
      const patchObject = Object.assign(
        {
          type: 'BBBBBB',
          createDate: currentDate.format(DATE_FORMAT),
          createBy: 'BBBBBB',
        },
        new BillDetails()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BillDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amount: 1,
          type: 'BBBBBB',
          createDate: currentDate.format(DATE_FORMAT),
          createBy: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a BillDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBillDetailsToCollectionIfMissing', () => {
      it('should add a BillDetails to an empty array', () => {
        const billDetails: IBillDetails = { id: 123 };
        expectedResult = service.addBillDetailsToCollectionIfMissing([], billDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(billDetails);
      });

      it('should not add a BillDetails to an array that contains it', () => {
        const billDetails: IBillDetails = { id: 123 };
        const billDetailsCollection: IBillDetails[] = [
          {
            ...billDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addBillDetailsToCollectionIfMissing(billDetailsCollection, billDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BillDetails to an array that doesn't contain it", () => {
        const billDetails: IBillDetails = { id: 123 };
        const billDetailsCollection: IBillDetails[] = [{ id: 456 }];
        expectedResult = service.addBillDetailsToCollectionIfMissing(billDetailsCollection, billDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(billDetails);
      });

      it('should add only unique BillDetails to an array', () => {
        const billDetailsArray: IBillDetails[] = [{ id: 123 }, { id: 456 }, { id: 94471 }];
        const billDetailsCollection: IBillDetails[] = [{ id: 123 }];
        expectedResult = service.addBillDetailsToCollectionIfMissing(billDetailsCollection, ...billDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const billDetails: IBillDetails = { id: 123 };
        const billDetails2: IBillDetails = { id: 456 };
        expectedResult = service.addBillDetailsToCollectionIfMissing([], billDetails, billDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(billDetails);
        expect(expectedResult).toContain(billDetails2);
      });

      it('should accept null and undefined values', () => {
        const billDetails: IBillDetails = { id: 123 };
        expectedResult = service.addBillDetailsToCollectionIfMissing([], null, billDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(billDetails);
      });

      it('should return initial array if no BillDetails is added', () => {
        const billDetailsCollection: IBillDetails[] = [{ id: 123 }];
        expectedResult = service.addBillDetailsToCollectionIfMissing(billDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(billDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
