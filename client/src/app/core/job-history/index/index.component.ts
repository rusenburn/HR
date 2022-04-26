import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobHistoryDetailModel } from 'src/app/models/job-histories/job-history-detail.model';
import { selectAllJobHistory, selectLoading } from 'src/app/stores/job-history/job-history.selectors';
import { readAll as readAllJobHistory } from 'src/app/stores/job-history/job-history.actions';
import { JobHistoryUpsertDialogComponent } from '../job-history-upsert-dialog/job-history-upsert-dialog.component';
import { readAll as readAllEmployees } from 'src/app/stores/employees/employees.actions';
import { JobHistoryUpdateModel } from 'src/app/models/job-histories/job-history-update';
import { readAll as readAllDepartments } from 'src/app/stores/departments/departments.actions';
import { readAll as readAllJobs } from 'src/app/stores/jobs/jobs.actions';
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
    private _dialog: MatDialog,
  ) {
    this.jobHistoryCollection$ = this._store.select(selectAllJobHistory);
    this.loading$ = this._store.select(selectLoading);
  }

  ngOnInit(): void {

    this._store.dispatch(readAllJobHistory());
  }

  public openDialog(jobHistory: JobHistoryUpdateModel | null): void {
    if (!this.dialogOpenedOnce) {
      this._store.dispatch(readAllEmployees());
      this._store.dispatch(readAllDepartments());
      this._store.dispatch(readAllJobs());
    };
    this._dialog.open(JobHistoryUpsertDialogComponent, {
      data: {
        jobHistory: jobHistory,
        create: jobHistory === null
      },
      disableClose: true,
      width: "600px"
    });
  }
}
