import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IBill, Bill } from '../bill.model';

import { BillService } from './bill.service';

describe('Bill Service', () => {
  let service: BillService;
  let httpMock: HttpTestingController;
  let elemDefault: IBill;
  let expectedResult: IBill | IBill[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BillService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
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

    it('should create a Bill', () => {
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

      service.create(new Bill()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Bill', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should partial update a Bill', () => {
      const patchObject = Object.assign({}, new Bill());

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

    it('should return a list of Bill', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a Bill', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBillToCollectionIfMissing', () => {
      it('should add a Bill to an empty array', () => {
        const bill: IBill = { id: 123 };
        expectedResult = service.addBillToCollectionIfMissing([], bill);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bill);
      });

      it('should not add a Bill to an array that contains it', () => {
        const bill: IBill = { id: 123 };
        const billCollection: IBill[] = [
          {
            ...bill,
          },
          { id: 456 },
        ];
        expectedResult = service.addBillToCollectionIfMissing(billCollection, bill);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Bill to an array that doesn't contain it", () => {
        const bill: IBill = { id: 123 };
        const billCollection: IBill[] = [{ id: 456 }];
        expectedResult = service.addBillToCollectionIfMissing(billCollection, bill);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bill);
      });

      it('should add only unique Bill to an array', () => {
        const billArray: IBill[] = [{ id: 123 }, { id: 456 }, { id: 30808 }];
        const billCollection: IBill[] = [{ id: 123 }];
        expectedResult = service.addBillToCollectionIfMissing(billCollection, ...billArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bill: IBill = { id: 123 };
        const bill2: IBill = { id: 456 };
        expectedResult = service.addBillToCollectionIfMissing([], bill, bill2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bill);
        expect(expectedResult).toContain(bill2);
      });

      it('should accept null and undefined values', () => {
        const bill: IBill = { id: 123 };
        expectedResult = service.addBillToCollectionIfMissing([], null, bill, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bill);
      });

      it('should return initial array if no Bill is added', () => {
        const billCollection: IBill[] = [{ id: 123 }];
        expectedResult = service.addBillToCollectionIfMissing(billCollection, undefined, null);
        expect(expectedResult).toEqual(billCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
