import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { JobHistoryDetailModel } from 'src/app/models/job-histories/job-history-detail.model';
import { openUpdateForm } from 'src/app/stores/job-history/job-history.actions';

@Component({
  selector: 'app-job-history-detail-table',
  templateUrl: './job-history-detail-table.component.html',
  styleUrls: ['./job-history-detail-table.component.css']
})
export class JobHistoryDetailTableComponent {
  @Input()
  jobHistoryCollection: JobHistoryDetailModel[] = [];
  displayedColumns: string[] = ["employee", "startDate", "endDate", "department", "job", "salary", "actions"];
  constructor(private _store: Store) { }

  edit(jobHistory: JobHistoryDetailModel): void {
    this._store.dispatch(openUpdateForm({ jobHistory }));
  }
    
  public parseDate(date: Date | null): string {
    // temporary solution
    if (date) {
      return new Date(Date.parse(date.toString())).toDateString();
    }
    return "N/A";
  }
}
