import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { MaterialsModule } from './materials.module';
import { NotFoundComponent } from './not-found.component';
import { RegionsTableComponent } from './tables/regions-table/regions-table.component';
import { CountriesTableComponent } from './tables/countries-table/countries-table.component';
import { DepartmentsTableComponent } from './tables/departments-table/departments-table.component';
import { EmployeesTableComponent } from './tables/employees-table/employees-table.component';
import { JobsTableComponent } from './tables/jobs-table/jobs-table.component';
import { JobHistoryDetailTableComponent } from './tables/job-history-detail-table/job-history-detail-table.component';
import { JobHistoryTableComponent } from './tables/job-history-table/job-history-table.component';
import { RegionsStore } from '../core/store/region/regions.store';
import { CountriesStore } from '../core/store/countries/countries.store';
import { DepartmentsStore } from '../core/store/departments/departments.store';
import { EmployeeStore } from '../core/store/employees/employees.store';
import { JobsStore } from '../core/store/jobs/jobs.store';
import { JobHisotryStore } from '../core/store/job-history/job-history.store';
import { RegionUpsertDialogComponent } from './dialoges/region-upsert-dialog/region-upsert-dialog.component';
import { CountryUpsertDialogComponent } from './dialoges/country-upsert-dialog/country-upsert-dialog.component';
import { DepartmentsUpsertDialogComponent } from './dialoges/departments-upsert-dialog/departments-upsert-dialog.component';
import { JobsUpsertDialogComponent } from './dialoges/jobs-upsert-dialog/jobs-upsert-dialog.component';
import { EmployeeUpsertDialogComponent } from './dialoges/employee-upsert-dialog/employee-upsert-dialog.component';
import { JobHistoryUpsertDialogComponent } from './dialoges/job-history-upsert-dialog/job-history-upsert-dialog.component';
import { RouterModule } from '@angular/router';
import { AccountStore } from '../core/store/account/account.store';

const components = [
  RegionsTableComponent,
  CountriesTableComponent,
  DepartmentsTableComponent,
  EmployeesTableComponent,
  JobsTableComponent,
  JobHistoryDetailTableComponent,
  JobHistoryTableComponent,

  RegionUpsertDialogComponent,
  CountryUpsertDialogComponent,
  DepartmentsUpsertDialogComponent,
  JobsUpsertDialogComponent,
  EmployeeUpsertDialogComponent,
  JobHistoryUpsertDialogComponent

];
const modules = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  MaterialsModule,
  RegionsStore,
  CountriesStore,
  DepartmentsStore,
  EmployeeStore,
  JobsStore,
  JobHisotryStore,
  AccountStore
];
@NgModule({
  declarations: [
    NotFoundComponent,
    components,

  ],
  imports: [
    modules,

  ],
  exports: [
    modules,
    components,
  ]
})
export class SharedModule { }
