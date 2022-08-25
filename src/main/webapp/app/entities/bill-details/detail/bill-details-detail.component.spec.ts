import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BillDetailsDetailComponent } from './bill-details-detail.component';

describe('BillDetails Management Detail Component', () => {
  let comp: BillDetailsDetailComponent;
  let fixture: ComponentFixture<BillDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ billDetails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BillDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BillDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load billDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.billDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
