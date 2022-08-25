import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBillDetails } from '../bill-details.model';

@Component({
  selector: 'jhi-bill-details-detail',
  templateUrl: './bill-details-detail.component.html',
})
export class BillDetailsDetailComponent implements OnInit {
  billDetails: IBillDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billDetails }) => {
      this.billDetails = billDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
