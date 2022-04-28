import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobModel } from 'src/app/models/jobs/job.model';
import { selectAllJobs, selectLoading } from 'src/app/stores/jobs/jobs.selectors';
import { JobUpdateModel } from 'src/app/models/jobs/job-update.model';
import { MatDialog } from '@angular/material/dialog';
import { JobsUpsertDialogComponent } from '../jobs-upsert-dialog/jobs-upsert-dialog.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  jobs$: Observable<JobModel[]>;
  loading$: Observable<boolean>;
  displayedColumns: string[];
  constructor(
    private _store: Store,
    private _dialog: MatDialog
  ) {
    this.jobs$ = this._store.select(selectAllJobs);
    this.loading$ = this._store.select(selectLoading);
    this.displayedColumns = ["jobId", "jobTitle", "minSalary", "maxSalary", "actions"];
  }

  public openDialog(job: JobUpdateModel | null): void {
    const dialog = this._dialog.open(JobsUpsertDialogComponent, {
      width: "600px",
      data: {
        job
      }
    })
  }
}
