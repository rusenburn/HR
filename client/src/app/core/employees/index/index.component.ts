import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EmployeeModel } from 'src/app/models/employees/employee.model';
import { selectAllEmployees, selectLoading } from 'src/app/stores/employees/employees.selectors';
import { readAll as readAllEmployees } from 'src/app/stores/employees/employees.actions';
import { EmployeeUpdateModel } from 'src/app/models/employees/employee-update.model';
import { EmployeeUpsertDialogComponent } from '../employee-upsert-dialog/employee-upsert-dialog.component';
import { defaultEmployeeQuery } from 'src/app/models/employees/employee-query.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  employees$: Observable<EmployeeModel[]>;
  loading$: Observable<boolean>;
  displayedColumns: string[];
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
  ) {
    this.employees$ = this._store.select(selectAllEmployees);
    this.loading$ = this._store.select(selectLoading);
    this.displayedColumns = ["employeeId", "firstName", "lastName", "actions"];
  }

  ngOnInit(): void {
    this._store.dispatch(readAllEmployees({ ...defaultEmployeeQuery }));
  }

  public openDialog(employee: EmployeeUpdateModel | null): void {
    console.log(employee);
    const di = this._dialog.open(EmployeeUpsertDialogComponent, {
      data: {
        employee
      },
      disableClose: true
    })
  }
}
