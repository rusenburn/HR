import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { EmployeeDetailModel } from 'src/app/models/employees/employee-detail.model';
import { readOne } from '../../../stores/employees/employees.actions';
import { selectEmployeeDetail, selectLoading } from '../../../stores/employees/employees.selectors';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee: EmployeeDetailModel | null = null;
  employee$: Observable<EmployeeDetailModel | null>;
  subscriptions: Subscription[] = [];
  loading$: Observable<boolean>;
  constructor(
    private _store: Store,
    private _route: ActivatedRoute,
  ) {
    this.employee$ = this._store.select(selectEmployeeDetail);
    this.loading$ = this._store.select(selectLoading);

    this.subscriptions.push(
      this._store.select(selectEmployeeDetail).subscribe(employee => {
        this.employee = employee
      })
    );
  }
  ngOnDestroy(): void {
    for (let sub of this.subscriptions) {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    }
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this._route.paramMap.subscribe(params => {
        const employeeId = +(params.get('employeeId') || '0');
        if (employeeId !== 0) {
          this._store.dispatch(readOne({ employeeId }));
        }
      })
    );
  }

  public parseDate(date: Date |string| null|undefined): string {
    // temporary solution
    if (date) {
      return new Date(Date.parse(date.toString())).toDateString();
    }
    return "N/A";
  }
}
