import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IStaff, Staff } from '../staff.model';
import { StaffService } from '../service/staff.service';

@Component({
  selector: 'jhi-staff-update',
  templateUrl: './staff-update.component.html',
})
export class StaffUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nameStaff: [null, [Validators.required]],
    ageStaff: [null, [Validators.required]],
    addressStaff: [null, [Validators.required]],
    numberphoneStaff: [null, [Validators.required]],
  });

  constructor(protected staffService: StaffService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ staff }) => {
      this.updateForm(staff);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const staff = this.createFromForm();
    if (staff.id !== undefined) {
      this.subscribeToSaveResponse(this.staffService.update(staff));
    } else {
      this.subscribeToSaveResponse(this.staffService.create(staff));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStaff>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(staff: IStaff): void {
    this.editForm.patchValue({
      id: staff.id,
      nameStaff: staff.nameStaff,
      ageStaff: staff.ageStaff,
      addressStaff: staff.addressStaff,
      numberphoneStaff: staff.numberphoneStaff,
    });
  }

  protected createFromForm(): IStaff {
    return {
      ...new Staff(),
      id: this.editForm.get(['id'])!.value,
      nameStaff: this.editForm.get(['nameStaff'])!.value,
      ageStaff: this.editForm.get(['ageStaff'])!.value,
      addressStaff: this.editForm.get(['addressStaff'])!.value,
      numberphoneStaff: this.editForm.get(['numberphoneStaff'])!.value,
    };
  }
}
