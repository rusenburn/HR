import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DepartmentModel } from 'src/app/models/departments/department.model';
import { EmployeeModel } from 'src/app/models/employees/employee.model';
import { JobHistoryCreateModel } from 'src/app/models/job-histories/job-history-create.model';
import { JobHistoryUpdateModel } from 'src/app/models/job-histories/job-history-update';
import { JobModel } from 'src/app/models/jobs/job.model';
import { selectAllDepartments } from 'src/app/stores/departments/departments.selectors';
import { selectAllEmployees } from 'src/app/stores/employees/employees.selectors';
import { selectAllJobs } from 'src/app/stores/jobs/jobs.selectors';
import { createOne, updateOne } from 'src/app/stores/job-history/job-history.actions';
import { selectIsCreateForm } from 'src/app/stores/job-history/job-history.selectors';
@Component({
  selector: 'app-job-history-upsert-dialog',
  templateUrl: './job-history-upsert-dialog.component.html',
  styleUrls: ['./job-history-upsert-dialog.component.css']
})
export class JobHistoryUpsertDialogComponent {
  jobHistoryForm: FormGroup | null = null;
  jobHistoryModel: JobHistoryCreateModel | null;
  employees$: Observable<EmployeeModel[]>;
  create$: Observable<boolean>;
  jobs$: Observable<JobModel[]>;
  departments$: Observable<DepartmentModel[]>;
  create: boolean = true;
  destroy$ = new Subject<void>();

  constructor(
    private _store: Store,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<JobHistoryUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    data: any) {
    this.employees$ = this._store.select(selectAllEmployees);
    this.jobs$ = this._store.select(selectAllJobs);
    this.departments$ = this._store.select(selectAllDepartments);
    this.create$ = this._store.select(selectIsCreateForm)
      .pipe(takeUntil(this.destroy$));

    this.create$.subscribe((isCreate) => {
      this.create = isCreate;
      if (isCreate) {
        this.jobHistoryForm = this._fb.group({
          employeeId: [0, [Validators.required, Validators.min(1)]],
          startDate: [Date.now(), [Validators.required]],
          salary: [0, [Validators.required, Validators.min(0)]],
          jobId: [0, [Validators.required, Validators.min(0)]],
          departmentId: [0, [Validators.required, Validators.min(0)]]
        })
      } else {
        this.jobHistoryForm = this._fb.group({
          endDate: [null,]
        });
      }
    });
    this.jobHistoryModel = data;
  }


  public submitForm(): void {
    if (!this.jobHistoryForm) return;
    if (this.create) {
      const model = this.createFormToModel();
      this._store.dispatch(createOne({ jobHistory: model }));
      return;
    }
    const model = this.updateFormToModel();
    this._store.dispatch(updateOne({ jobHistory: model }));
  }

  public close(): void {
    this._dialogRef.close();
  }

  private createFormToModel(): JobHistoryCreateModel {
    const model: JobHistoryCreateModel = {
      employeeId: this.jobHistoryForm?.value.employeeId,
      startDate: (this.jobHistoryForm?.value.startDate as Date).toISOString(),
      salary: this.jobHistoryForm?.value.salary || 0,
      jobId: this.jobHistoryForm?.value.jobId || 0,
      departmentId: this.jobHistoryForm?.value.departmentId || 0
    };
    return model;
  }

  private updateFormToModel(): JobHistoryUpdateModel {
    if (!this.jobHistoryModel) {
      throw Error("Job History Model is null or undefined");
    }
    const model: JobHistoryUpdateModel = {
      employeeId: this.jobHistoryModel.employeeId,
      startDate: this.jobHistoryModel.startDate,
      endDate: (this.jobHistoryForm?.value.endDate as Date).toISOString() || null
    }
    return model;
  }
}
