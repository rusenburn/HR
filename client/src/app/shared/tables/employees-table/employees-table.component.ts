import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { defaultEmployeeFilter, EmployeeFilterModel } from 'src/app/models/employees/employee-filter.model';
import { defaultEmployeeQuery } from 'src/app/models/employees/employee-query.model';
import { EmployeeModel } from 'src/app/models/employees/employee.model';
import { openForm, readAll, removeFilters, setFilters, textFilterChanged, updatePagination, updateSorting } from 'src/app/stores/employees/employees.actions';
import { selectFilteredEmployeesLength, selectPageIndex, selectPageSize, selectEmployeesPage } from 'src/app/stores/employees/employees.selectors';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.css']
})
export class EmployeesTableComponent implements OnDestroy {
  displayedColumns: string[] = ["employeeId", "firstName", "lastName", "actions"];
  employees$: Observable<EmployeeModel[]>;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  length$: Observable<number>;
  destory$ = new Subject<void>();
  textFilter:string="";
  constructor(private _router: Router, private _store: Store, private _route: ActivatedRoute) {
    this.employees$ = this._store.select(selectEmployeesPage);
    this.pageIndex$ = this._store.select(selectPageIndex);
    this.pageSize$ = this._store.select(selectPageSize);
    this.length$ = this._store.select(selectFilteredEmployeesLength);
    this._store.dispatch(readAll({ ...defaultEmployeeQuery }));
    this._route.paramMap.pipe(
      switchMap(param => {
        const filters: EmployeeFilterModel = { ...defaultEmployeeFilter };
        const departmentId = +(param.get('departmentId') ?? '0');
        const employeeId = +(param.get('employeeId') ?? '0');
        const jobId = +(param.get('jobId') ?? '0');
        if (departmentId || employeeId || jobId) {
          this._store.dispatch(setFilters({
            filters: {
              ...filters,
              departmentId: departmentId,
              managerId: employeeId,
              jobId: jobId
            }
          }));
        } else {
          this._store.dispatch(removeFilters());
        }
        return of();
      }),
      takeUntil(this.destory$))
      .subscribe()
  }


  public edit(employee: EmployeeModel): void {
    this._store.dispatch(openForm({ employee }));
  }

  public detail(employeeId: number): void {
    this._router.navigate(["/employees", employeeId]);
  }

  public onPageEvent(pageEvent: PageEvent): void {
    this._store.dispatch(updatePagination({ pageIndex: pageEvent.pageIndex, pageSize: pageEvent.pageSize }));
  }
  public sortChange(sortState: Sort): void {
    this._store.dispatch(updateSorting({ sortActive: sortState.active, asc: sortState.direction === "asc" }));
  }
  public textFilterChange():void{
    this._store.dispatch(textFilterChanged({textFilter:this.textFilter}));
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
