import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeModel } from 'src/app/models/employees/employee.model';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.css']
})
export class EmployeesTableComponent {
  @Input()
  employees: EmployeeModel[] = [];
  displayedColumns: string[] = ["employeeId", "firstName", "lastName", "actions"];

  @Output()
  editEmployee = new EventEmitter<EmployeeModel>();
  constructor(private _router: Router) { }

  public edit(employee: EmployeeModel): void {
    return this.editEmployee.emit(employee);
  }

  public detail(employeeId: number): void {
    this._router.navigate(["/employees", employeeId]);
  }
}
