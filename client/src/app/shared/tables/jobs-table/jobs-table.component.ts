import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { JobModel } from 'src/app/models/jobs/job.model';

@Component({
  selector: 'app-jobs-table',
  templateUrl: './jobs-table.component.html',
  styleUrls: ['./jobs-table.component.css']
})
export class JobsTableComponent {
  @Input()
  jobs: JobModel[] = [];
  @Output()
  editJob = new EventEmitter<JobModel>();
  displayedColumns: string[] = ["jobId", "jobTitle", "minSalary", "maxSalary", "actions"];
  constructor(private _router: Router) { }

  public edit(job: JobModel): void {
    this.editJob.emit(job);
  }

  public detail(jobId: number): void {
    this._router.navigate(["/jobs", jobId]);
  }
}
