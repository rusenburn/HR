import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentLocationedModel } from 'src/app/models/departments/department-locationed';


@Component({
  selector: 'app-departments-table',
  templateUrl: './departments-table.component.html',
  styleUrls: ['./departments-table.component.css']
})
export class DepartmentsTableComponent {
  @Input()
  departments: DepartmentLocationedModel[] = [];
  @Output()
  editDepartment = new EventEmitter<DepartmentLocationedModel>();
  displayedColumns: string[] = ["departmentId", "departmentName", "city", "streetAddress", "actions"];
  constructor(private _router: Router) { }

  public edit(department: DepartmentLocationedModel): void {
    this.editDepartment.emit(department);
  }

  public detail(departmentId: number): void {
    this._router.navigate(["/departments", departmentId]);
  }
}
