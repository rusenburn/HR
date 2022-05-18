import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { defaultCountryQuery } from 'src/app/models/countries/country-query.model';
import { DepartmentLocationedModel } from 'src/app/models/departments/department-locationed';
import { readAll as readAllCountries } from 'src/app/core/store/countries/countries.action';
import { clearCountryFilter, setCountryFilter, textFilterChanged, updatePagination, updateSorting } from 'src/app/core/store/departments/departments.actions';
import { selectFilteredDepartmentsLength, selectPageIndex, selectPageSize, selectSortedCountryDepartmentsSlice } from 'src/app/core/store/departments/departments.selectors';


@Component({
  selector: 'app-departments-table',
  templateUrl: './departments-table.component.html',
  styleUrls: ['./departments-table.component.css']
})
export class DepartmentsTableComponent implements OnDestroy {
  departments$: Observable<DepartmentLocationedModel[]>;
  length$: Observable<number>;
  destroy$ = new Subject<void>();
  @Output()
  editDepartment = new EventEmitter<DepartmentLocationedModel>();
  displayedColumns: string[] = ["departmentId", "departmentName", "city", "streetAddress", "actions"];
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  textFilter: string = "";
  constructor(
    private _router: Router,
    private _store: Store,
    private _route: ActivatedRoute) {

    this.departments$ = this._store.select(selectSortedCountryDepartmentsSlice);
    this.length$ = this._store.select(selectFilteredDepartmentsLength);
    this.pageIndex$ = this._store.select(selectPageIndex);
    this.pageSize$ = this._store.select(selectPageSize);

    this._store.dispatch(readAllCountries({ ...defaultCountryQuery }));

    this._route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          const countryId = +(params.get("countryId") ?? '0');
          if (countryId) {
            this._store.dispatch(setCountryFilter({ countryId }));
          } else {
            this._store.dispatch(clearCountryFilter());
          };
          return of();
        })
      ).subscribe();
  }

  public edit(department: DepartmentLocationedModel): void {
    this.editDepartment.emit(department);
  }

  public detail(departmentId: number): void {
    this._router.navigate(["/departments", departmentId]);
  }

  public onPageEvent(pageEvent: PageEvent) {
    this._store.dispatch(
      updatePagination({
        pageIndex: pageEvent.pageIndex,
        pageSize: pageEvent.pageSize
      }));
  }
  public sortChange(sortState: Sort) {
    this._store.dispatch(updateSorting({ active: sortState.active, asc: sortState.direction === "asc" }));
  }

  public textFilterChange():void{
    this._store.dispatch(textFilterChanged({textFilter:this.textFilter}))
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}





