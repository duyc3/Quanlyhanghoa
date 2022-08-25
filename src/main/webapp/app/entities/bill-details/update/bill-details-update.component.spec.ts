import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BillDetailsService } from '../service/bill-details.service';
import { IBillDetails, BillDetails } from '../bill-details.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IBill } from 'app/entities/bill/bill.model';
import { BillService } from 'app/entities/bill/service/bill.service';

import { BillDetailsUpdateComponent } from './bill-details-update.component';

describe('BillDetails Management Update Component', () => {
  let comp: BillDetailsUpdateComponent;
  let fixture: ComponentFixture<BillDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let billDetailsService: BillDetailsService;
  let productService: ProductService;
  let billService: BillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BillDetailsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BillDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BillDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    billDetailsService = TestBed.inject(BillDetailsService);
    productService = TestBed.inject(ProductService);
    billService = TestBed.inject(BillService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Product query and add missing value', () => {
      const billDetails: IBillDetails = { id: 456 };
      const product: IProduct = { id: 91307 };
      billDetails.product = product;

      const productCollection: IProduct[] = [{ id: 37022 }];
      jest.spyOn(productService, 'query').mockReturnValue(of(new HttpResponse({ body: productCollection })));
      const additionalProducts = [product];
      const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
      jest.spyOn(productService, 'addProductToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ billDetails });
      comp.ngOnInit();

      expect(productService.query).toHaveBeenCalled();
      expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
      expect(comp.productsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Bill query and add missing value', () => {
      const billDetails: IBillDetails = { id: 456 };
      const bill: IBill = { id: 74188 };
      billDetails.bill = bill;

      const billCollection: IBill[] = [{ id: 23549 }];
      jest.spyOn(billService, 'query').mockReturnValue(of(new HttpResponse({ body: billCollection })));
      const additionalBills = [bill];
      const expectedCollection: IBill[] = [...additionalBills, ...billCollection];
      jest.spyOn(billService, 'addBillToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ billDetails });
      comp.ngOnInit();

      expect(billService.query).toHaveBeenCalled();
      expect(billService.addBillToCollectionIfMissing).toHaveBeenCalledWith(billCollection, ...additionalBills);
      expect(comp.billsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const billDetails: IBillDetails = { id: 456 };
      const product: IProduct = { id: 43996 };
      billDetails.product = product;
      const bill: IBill = { id: 72721 };
      billDetails.bill = bill;

      activatedRoute.data = of({ billDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(billDetails));
      expect(comp.productsSharedCollection).toContain(product);
      expect(comp.billsSharedCollection).toContain(bill);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BillDetails>>();
      const billDetails = { id: 123 };
      jest.spyOn(billDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: billDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(billDetailsService.update).toHaveBeenCalledWith(billDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BillDetails>>();
      const billDetails = new BillDetails();
      jest.spyOn(billDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: billDetails }));
      saveSubject.complete();

      // THEN
      expect(billDetailsService.create).toHaveBeenCalledWith(billDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BillDetails>>();
      const billDetails = { id: 123 };
      jest.spyOn(billDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(billDetailsService.update).toHaveBeenCalledWith(billDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProductById', () => {
      it('Should return tracked Product primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProductById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBillById', () => {
      it('Should return tracked Bill primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBillById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
