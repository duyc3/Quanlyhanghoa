import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BillService } from '../service/bill.service';

import { BillComponent } from './bill.component';

describe('Bill Management Component', () => {
  let comp: BillComponent;
  let fixture: ComponentFixture<BillComponent>;
  let service: BillService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BillComponent],
    })
      .overrideTemplate(BillComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BillComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BillService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.bills?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
