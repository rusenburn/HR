import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectAllDepartments, selectLoading } from 'src/app/stores/departments/departments.selectors';
import { readAll as readAllDepartments } from 'src/app/stores/departments/departments.actions';
import { DepartmentsUpsertDialogComponent } from '../departments-upsert-dialog/departments-upsert-dialog.component';
import { CountryModel } from 'src/app/models/countries/country.model';
import { selectAllCountries } from 'src/app/stores/countries/countries.selectors';
import { readAll as readAllCountries } from 'src/app/stores/countries/countries.action';
import { DepartmentLocationedModel } from 'src/app/models/departments/department-locationed';
import { defaultCountryQuery } from 'src/app/models/countries/country-query.model';
import { defaultDepartmentQuery } from 'src/app/models/departments/department-query.model';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  departments$: Observable<DepartmentLocationedModel[]>;
  countries$: Observable<CountryModel[]>;
  countries: CountryModel[] = [];
  loading$: Observable<boolean>;
  displayedColumns: string[];
  subs: Subscription[] = [];
  constructor(
    private _store: Store,
    private _dialog: MatDialog,
  ) {
    this.departments$ = this._store.select(selectAllDepartments);
    this.loading$ = this._store.select(selectLoading);
    this.countries$ = this._store.select(selectAllCountries);
    let sub = this.countries$.subscribe((countries) => {
      this.countries = countries
    });
    this.subs.push(sub);
    this.displayedColumns = ["departmentId", "departmentName", "city", "streetAddress", "actions"];
  }
  ngOnDestroy(): void {
    for (let sub of this.subs) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this._store.dispatch(readAllDepartments({ ...defaultDepartmentQuery }));
    this._store.dispatch(readAllCountries({ ...defaultCountryQuery }));
  }

  openDialog(department: DepartmentLocationedModel | null): void {
    const countries = this.countries;
    const dialog = this._dialog.open(DepartmentsUpsertDialogComponent, {
      width: "600px",
      data: {
        department,
        countries
      }
    });
  }
}
