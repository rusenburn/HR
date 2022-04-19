import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DepartmentModel } from 'src/app/models/departments/department.model';
import { selectAllDepartmets, selectLoading } from '../store/departments.selectors';
import { readAll as readAllDepartments } from '../store/departments.actions';
import { DepartmentsUpsertDialogComponent } from '../departments-upsert-dialog/departments-upsert-dialog.component';
import { DepartmentUpdateModel } from 'src/app/models/departments/department-update.model';
import { CountryModel } from 'src/app/models/countries/country.model';
import { selectAllCountries } from '../../countries/store/countries.selectors';
import { readAll as readAllCountries } from '../../countries/store/countries.action';
import { DepartmentLocationedModel } from 'src/app/models/departments/department-locationed';
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
    this.departments$ = this._store.select(selectAllDepartmets);
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
    this._store.dispatch(readAllDepartments());
    this._store.dispatch(readAllCountries());
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
