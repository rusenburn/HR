import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { defaultCountryQuery } from 'src/app/models/countries/country-query.model';
import { CountryModel } from 'src/app/models/countries/country.model';
import { DepartmentLocationedModel } from 'src/app/models/departments/department-locationed';
import { DepartmentUpdateModel } from 'src/app/models/departments/department-update.model';
import { LocationUpdateModel } from 'src/app/models/locations/location-update.model';
import { readAll as readAllCountries } from 'src/app/stores/countries/countries.action';
import { selectAllCountries } from 'src/app/stores/countries/countries.selectors';
import { createOne, updateOne } from "src/app/stores/departments/departments.actions";

@Component({
  selector: 'app-departments-upsert-dialog',
  templateUrl: './departments-upsert-dialog.component.html',
  styleUrls: ['./departments-upsert-dialog.component.css']
})
export class DepartmentsUpsertDialogComponent implements OnInit {
  public department: DepartmentUpdateModel;
  public location: LocationUpdateModel;
  public countries$: Observable<CountryModel[]>;
  public departmentForm: FormGroup;
  constructor(
    private _store: Store,
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<DepartmentsUpsertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DepartmentLocationedModel
  ) {
    this.department = { ...data };
    this.location = { ...data?.location };
    this.countries$ = this._store.select(selectAllCountries);

    this.departmentForm = this._fb.group({
      departmentName: [this.department?.departmentName || "", [Validators.required, Validators.maxLength(52)]],
      countryId: [this.location?.countryId || 0, [Validators.required, Validators.min(1)]],
      city: [this.location?.city || "", [Validators.required, Validators.maxLength(52)]],
      stateProvince: [this.location?.stateProvince || "", [Validators.required, Validators.maxLength(52)]],
      postalCode: [this.location?.postalCode || null, [Validators.maxLength(52)]],
      streetAddress: [this.location?.streetAddress || "", [Validators.required, Validators.maxLength(52)]]
    });
  }

  ngOnInit(): void {
    this._store.dispatch(readAllCountries({ ...defaultCountryQuery }));
  }
  public submitForm(): void {
    const model = this.formToModel();
    const department = model.department;
    const location = model.location;
    if (model.department.departmentId) {
      this._store.dispatch(updateOne({ department, location }));
    } else {
      this._store.dispatch(createOne({ department, location }))
    }
  }

  private formToModel() {
    const department: DepartmentUpdateModel = {
      departmentId: this.department?.departmentId || 0,
      departmentName: this.departmentForm.value.departmentName,
      locationId: this.department?.locationId || 0
    };
    const location: LocationUpdateModel = {
      locationId: this.location?.locationId || 0,
      city: this.departmentForm.value.city,
      stateProvince: this.departmentForm.value.stateProvince,
      countryId: this.departmentForm.value.countryId,
      postalCode: this.departmentForm.value.postalCode,
      streetAddress: this.departmentForm.value.streetAddress
    }
    const model = {
      department,
      location
    };
    return model;
  }
  public close(): void {
    this.dialogRef.close();
  }
}
