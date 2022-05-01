import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobModel } from 'src/app/models/jobs/job.model';
import { selectAllJobs, selectLoading } from 'src/app/stores/jobs/jobs.selectors';
import { openForm } from 'src/app/stores/jobs/jobs.actions';

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
  ) {
    this.jobs$ = this._store.select(selectAllJobs);
    this.loading$ = this._store.select(selectLoading);
    this.displayedColumns = ["jobId", "jobTitle", "minSalary", "maxSalary", "actions"];
  }

  public openDialog(): void {
    this._store.dispatch(openForm({ job: null }));
  }
}
