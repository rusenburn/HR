import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { defaultJobHistoryFilter } from 'src/app/models/job-histories/job-history-filter.model';
import { JobHistoryModel } from 'src/app/models/job-histories/job-history.model';
import { openUpdateForm, readAll, removeFilter, setFilter, textFilterChanged, updatePagination, updateSorting } from 'src/app/stores/job-history/job-history.actions';
import { selectJobHistoryLength, selectJobHistoryPage, selectPageIndex, selectPageSize } from 'src/app/stores/job-history/job-history.selectors';

@Component({
  selector: 'app-job-history-table',
  templateUrl: './job-history-table.component.html',
  styleUrls: ['./job-history-table.component.css']
})
export class JobHistoryTableComponent implements OnDestroy, OnInit {
  displayedColumns: string[] = ["employeeId", "startDate", "endDate", "departmentId", "jobId", "salary", "actions"];
  jobHistoryCollection$: Observable<JobHistoryModel[]>;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  destroy$ = new Subject<void>();
  length$: Observable<number>;
  textFilter:string="";

  constructor(private _store: Store, private _route: ActivatedRoute) {
    this.jobHistoryCollection$ = this._store.select(selectJobHistoryPage);
    this.pageIndex$ = this._store.select(selectPageIndex);
    this.pageSize$ = this._store.select(selectPageSize);
    this.length$ = this._store.select(selectJobHistoryLength);

    this._route.paramMap.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const departmentId = +(params.get('departmentId') ?? '0');
        const employeeId = +(params.get('employeeId') ?? '0');
        const jobId = +(params.get('jobId') ?? '0');
        if (departmentId || employeeId || jobId) {
          const filter = {
            ...defaultJobHistoryFilter,
            departmentId,
            employeeId,
            jobId
          };
          this._store.dispatch(setFilter({ filter }))
        } else {
          this._store.dispatch(removeFilter());
        }
        return of();
      }),
    ).subscribe();
  }

  edit(jobHistory: JobHistoryModel): void {
    this._store.dispatch(openUpdateForm({ jobHistory }));
  }

  public parseDate(date: Date | null | undefined | string): string {
    // temporary solution
    if (date) {
      return new Date(Date.parse(date.toString())).toDateString();
    }
    return "N/A";
  }

  public onPageEvent(pageEvent: PageEvent): void {
    this._store.dispatch(updatePagination({ pageIndex: pageEvent.pageIndex, pageSize: pageEvent.pageSize }));
  }

  public onSortChange(sortState: Sort): void {
    this._store.dispatch(updateSorting({ sortActive: sortState.active, asc: sortState.direction === "asc" }));
  }
  public onTextFilterChange():void{
    this._store.dispatch(textFilterChanged({textFilter:this.textFilter}));
  }
  ngOnInit(): void {
    this._store.dispatch(readAll());
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
