import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobHistoryDetailModel } from 'src/app/models/job-histories/job-history-detail.model';

@Component({
  selector: 'app-job-history-detail-table',
  templateUrl: './job-history-detail-table.component.html',
  styleUrls: ['./job-history-detail-table.component.css']
})
export class JobHistoryDetailTableComponent {
  @Input()
  jobHistoryCollection: JobHistoryDetailModel[] = [];
  @Output()
  editJobHistory = new EventEmitter<JobHistoryDetailModel>();
  displayedColumns: string[] = ["employee", "startDate", "endDate", "department", "job", "salary", "actions"];
  constructor() { }

  edit(jobHistory: JobHistoryDetailModel): void {
    this.editJobHistory.emit(jobHistory);
  }

  public parseDate(date: Date | null): string {
    // temporary solution
    if (date) {
      return new Date(Date.parse(date.toString())).toDateString();
    }
    return "N/A";
  }
}
