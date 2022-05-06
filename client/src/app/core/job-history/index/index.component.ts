import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobHistoryDetailModel } from 'src/app/models/job-histories/job-history-detail.model';
import { selectAllJobHistory, selectLoading } from 'src/app/stores/job-history/job-history.selectors';
import { openCreateForm, openUpdateForm, readAll as readAllJobHistory } from 'src/app/stores/job-history/job-history.actions';
import { readAll as readAllEmployees } from 'src/app/stores/employees/employees.actions';
import { JobHistoryUpdateModel } from 'src/app/models/job-histories/job-history-update';
import { readAll as readAllDepartments } from 'src/app/stores/departments/departments.actions';
import { readAll as readAllJobs } from 'src/app/stores/jobs/jobs.actions';
import { defaultDepartmentQuery } from 'src/app/models/departments/department-query.model';
import { defaultJobQuery } from 'src/app/models/jobs/job-query.model';
import { defaultEmployeeQuery } from 'src/app/models/employees/employee-query.model';
// import { JobHistoryCreateModel } from 'src/app/models/job-histories/job-history-create.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  jobHistoryCollection$: Observable<JobHistoryDetailModel[]>;
  loading$: Observable<boolean>;
  dialogOpenedOnce: boolean = false;

  constructor(
    private _store: Store,
  ) {
    this.jobHistoryCollection$ = this._store.select(selectAllJobHistory);
    this.loading$ = this._store.select(selectLoading);
  }

  ngOnInit(): void {

    this._store.dispatch(readAllJobHistory());
  }

  public createNew(): void {
    if (!this.dialogOpenedOnce) {
      this._store.dispatch(readAllEmployees({ ...defaultEmployeeQuery }));
      this._store.dispatch(readAllDepartments({ ...defaultDepartmentQuery }));
      this._store.dispatch(readAllJobs({ ...defaultJobQuery }));
    };
    this._store.dispatch(openCreateForm({ jobHistory:null }));
  }
}
