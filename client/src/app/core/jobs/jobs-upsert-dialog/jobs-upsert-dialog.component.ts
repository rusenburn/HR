import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { JobUpdateModel } from 'src/app/models/jobs/job-update.model';
import { createOne, createOneSuccess, updateOne, updateOneSuccess } from "src/app/stores/jobs/jobs.actions";
import { CustomValidators } from 'src/app/shared/validators/customValidators.validator';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-jobs-upsert-dialog',
  templateUrl: './jobs-upsert-dialog.component.html',
  styleUrls: ['./jobs-upsert-dialog.component.css']
})
export class JobsUpsertDialogComponent implements OnInit, OnDestroy {
  job: JobUpdateModel;
  jobForm: FormGroup;
  private destroy$ = new Subject<void>();
  constructor(
    private _store: Store,
    private _fb: FormBuilder,
    private diaglogRef: MatDialogRef<JobsUpsertDialogComponent>,
    private actions$: Actions,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.job = data.job;
    this.jobForm = this._fb.group({
      jobTitle: [this.job?.jobTitle, [Validators.required, Validators.maxLength(52)]],
      minSalary: [this.job?.minSalary, [Validators.required, Validators.min(0)]],
      maxSalary: [this.job?.maxSalary, [Validators.required, Validators.min(0)]]
    })
    this.jobForm.addValidators([CustomValidators.notSmaller("maxSalary", "minSalary")]);
  }

  ngOnInit(): void {
    this.actions$
      .pipe(takeUntil(this.destroy$), ofType(createOneSuccess,updateOneSuccess))
      .subscribe(() => this.diaglogRef.close())
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public submitForm(): void {
    const model = this.formToModel();
    if (model.jobId) {
      this._store.dispatch(updateOne({ job: model }));
    } else {
      console.log(model);
      this._store.dispatch(createOne({ job: model }));
    }
  }

  private formToModel() {
    const model: JobUpdateModel = {
      jobId: this.job?.jobId || 0,
      jobTitle: this.jobForm.value.jobTitle,
      minSalary: this.jobForm.value.minSalary,
      maxSalary: this.jobForm.value.maxSalary
    }
    return model;
  }


  public close() {
    this.diaglogRef.close();
  }
}
