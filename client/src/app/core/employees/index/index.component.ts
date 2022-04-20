import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EmployeeModel } from 'src/app/models/employees/employee.model';
import { selectAllEmployees, selectLoading } from '../store/employees.selectors';
import { readAll as readAllEmployees } from '../store/employees.actions';
import { EmployeeUpdateModel } from 'src/app/models/employees/employee-update.model';
import { EmployeeUpsertDialogComponent } from '../employee-upsert-dialog/employee-upsert-dialog.component';

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
    this.displayedColumns = ["employeeId", "firstName", "lastName","actions"];
  }

  ngOnInit(): void {
    this._store.dispatch(readAllEmployees());
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
