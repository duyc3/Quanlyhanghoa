import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BillDetailComponent } from './bill-detail.component';

describe('Bill Management Detail Component', () => {
  let comp: BillDetailComponent;
  let fixture: ComponentFixture<BillDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bill: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BillDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BillDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bill on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bill).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
