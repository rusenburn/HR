import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobHistoryModel } from 'src/app/models/job-histories/job-history.model';

@Component({
  selector: 'app-job-history-table',
  templateUrl: './job-history-table.component.html',
  styleUrls: ['./job-history-table.component.css']
})
export class JobHistoryTableComponent {
  @Input()
  jobHistoryCollection: JobHistoryModel[] = [];
  @Output()
  editHistory = new EventEmitter<JobHistoryModel>();
  displayedColumns: string[] = ["employeeId","startDate", "endDate", "departmentId", "jobId", "salary", "actions"];
  constructor() { }

  edit(jobHistory: JobHistoryModel): void {
    this.editHistory.emit(jobHistory);
  }

  public parseDate(date: Date | null | undefined | string): string {
    // temporary solution
    if (date) {
      return new Date(Date.parse(date.toString())).toDateString();
    }
    return "N/A";
  }

}
