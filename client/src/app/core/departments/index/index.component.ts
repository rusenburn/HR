import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAllDepartments, selectLoading } from 'src/app/stores/departments/departments.selectors';
import { openForm, readAll as readAllDepartments } from 'src/app/stores/departments/departments.actions';
import { CountryModel } from 'src/app/models/countries/country.model';
import { readAll as readAllCountries } from 'src/app/stores/countries/countries.action';
import { DepartmentLocationedModel } from 'src/app/models/departments/department-locationed';
import { defaultCountryQuery } from 'src/app/models/countries/country-query.model';
import { defaultDepartmentQuery } from 'src/app/models/departments/department-query.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  departments$: Observable<DepartmentLocationedModel[]>;
  // countries$: Observable<CountryModel[]>;
  countries: CountryModel[] = [];
  loading$: Observable<boolean>;
  displayedColumns: string[];
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
  ) {
    this.departments$ = this._store.select(selectAllDepartments);
    this.loading$ = this._store.select(selectLoading);
    this.displayedColumns = ["departmentId", "departmentName", "city", "streetAddress", "actions"];
  }
  

  ngOnInit(): void {
    this._store.dispatch(readAllDepartments({ ...defaultDepartmentQuery }));
    this._store.dispatch(readAllCountries({ ...defaultCountryQuery }));
  }

  openDialog(department: DepartmentLocationedModel | null): void {
    this._store.dispatch(openForm({department:department}));
  }
}
