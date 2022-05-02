import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { defaultJobQuery } from 'src/app/models/jobs/job-query.model';
import { JobModel } from 'src/app/models/jobs/job.model';
import { openForm, readAll, textFilterChanged, updatePagination, updateSorting } from 'src/app/stores/jobs/jobs.actions';
import {  selectPageIndex, selectPageSize, selectJobsPage, selectFilteredJobsLength } from 'src/app/stores/jobs/jobs.selectors';



@Component({
  selector: 'app-jobs-table',
  templateUrl: './jobs-table.component.html',
  styleUrls: ['./jobs-table.component.css']
})
export class JobsTableComponent {
  jobs$: Observable<JobModel[]>;
  displayedColumns: string[] = ["jobId", "jobTitle", "minSalary", "maxSalary", "actions"];
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  length$: Observable<number>;
  textFilter:string="";
  constructor(private _router: Router, private _store: Store) {
    this.jobs$ = this._store.select(selectJobsPage);
    this.pageSize$ = this._store.select(selectPageSize);
    this.pageIndex$ = this._store.select(selectPageIndex);
    this.length$ = this._store.select(selectFilteredJobsLength);
    this._store.dispatch(readAll({ ...defaultJobQuery }));
  }

  public edit(job: JobModel): void {
        this._store.dispatch(openForm({ job }));
  }

  public detail(jobId: number): void {
    this._router.navigate(["/jobs", jobId]);
  }

  public onPageEvent(pageEvent: PageEvent): void {
    this._store.dispatch(updatePagination({ pageIndex: pageEvent.pageIndex, pageSize: pageEvent.pageSize }));
  }
  public sortChange(sortState: Sort) {
    this._store.dispatch(updateSorting({ sortActive: sortState.active, asc: sortState.direction === "asc" }));
  }

  public textFilterChange():void{
    this._store.dispatch(textFilterChanged({textFilter:this.textFilter}));
  }
}
