import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobHistoryDetailModel } from 'src/app/models/job-histories/job-history-detail.model';
import { openUpdateForm, textFilterChanged, updatePagination, updateSorting } from 'src/app/core/store/job-history/job-history.actions';
import { selectJobHistoryLength, selectJobHistoryPage, selectPageIndex, selectPageSize } from 'src/app/core/store/job-history/job-history.selectors';
import { JobHistoryModel } from 'src/app/models/job-histories/job-history.model';
@Component({
  selector: 'app-job-history-detail-table',
  templateUrl: './job-history-detail-table.component.html',
  styleUrls: ['./job-history-detail-table.component.css']
})
export class JobHistoryDetailTableComponent {
  // @Input()
  // jobHistoryCollection: JobHistoryDetailModel[] = [];
  textFilter: string = "";

  displayedColumns: string[] = ["employee", "startDate", "endDate", "department", "job", "salary", "actions"];
  jobHistoryCollection$: Observable<JobHistoryModel[]>;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  length$: Observable<number>;
  constructor(private _store: Store) {
    this.jobHistoryCollection$ = this._store.select(selectJobHistoryPage);
    this.pageIndex$ = this._store.select(selectPageIndex);
    this.pageSize$ = this._store.select(selectPageSize);
    this.length$ = this._store.select(selectJobHistoryLength);
  }

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

  public onPageEvent(pageEvent: PageEvent): void {
    this._store.dispatch(updatePagination({ pageIndex: pageEvent.pageIndex, pageSize: pageEvent.pageSize }));
  }
  public sortChange(sortState: Sort): void {
    this._store.dispatch(updateSorting({ sortActive: sortState.active, asc: sortState.direction === "asc" }));
  }
  public onTextFilterChange(): void {
    this._store.dispatch(textFilterChanged({ textFilter: this.textFilter }))
  }
}
