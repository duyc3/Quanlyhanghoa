import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBill } from '../bill.model';

@Component({
  selector: 'jhi-bill-detail',
  templateUrl: './bill-detail.component.html',
})
export class BillDetailComponent implements OnInit {
  bill: IBill | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bill }) => {
      this.bill = bill;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
