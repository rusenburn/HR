import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { EmployeeUpdateModel } from 'src/app/models/employees/employee-update.model';
import { CustomValidators } from 'src/app/shared/validators/customValidators.validator';
import { createOne, updateOne } from 'src/app/stores/employees/employees.actions';

@Component({
  selector: 'app-employee-upsert-dialog',
  templateUrl: './employee-upsert-dialog.component.html',
  styleUrls: ['./employee-upsert-dialog.component.css']
})
export class EmployeeUpsertDialogComponent {
  employee: EmployeeUpdateModel | null;
  employeeForm: FormGroup;
  constructor(private _store: Store,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<EmployeeUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.employee = { ...data.employee };
    console.log(this.employee);
    this.employeeForm = this._fb.group({
      firstName: [this.employee?.firstName || "", [Validators.required, Validators.maxLength(52)]],
      lastName: [this.employee?.lastName || "", [Validators.required, Validators.maxLength(52)]],
      email: [this.employee?.email || "", [Validators.required, Validators.email, Validators.maxLength(52)]],
      phoneNumber: [this.employee?.phoneNumber, [Validators.required, Validators.maxLength(52), CustomValidators.onlyDigits]],
    });
  }

  public submitForm(): void {
    const model = this.formToModel();
    if (model.employeeId) {
      this._store.dispatch(updateOne({ employee: model }));
    } else {
      this._store.dispatch(createOne({ employee: model }));
    }
  }

  private formToModel(): EmployeeUpdateModel {
    const model: EmployeeUpdateModel = {
      employeeId: this.employee?.employeeId || 0,
      firstName: this.employeeForm.value.firstName,
      lastName: this.employeeForm.value.lastName,
      email: this.employeeForm.value.email,
      phoneNumber: this.employeeForm.value.phoneNumber,
      managerId: this.employee?.managerId || 0
    };
    return model;
  }

  public close() {
    this._dialogRef.close();
  }
}
