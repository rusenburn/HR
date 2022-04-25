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

const components = [
  RegionsTableComponent,
  CountriesTableComponent,
  DepartmentsTableComponent,
  EmployeesTableComponent,
  JobsTableComponent,
  JobHistoryDetailTableComponent,
  JobHistoryTableComponent,
];
const modules = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  MaterialsModule
];
@NgModule({
  declarations: [
    NotFoundComponent,
    components,
    
  ],
  imports: [
    modules
  ],
  exports: [
    modules,
    components,
  ]
})
export class SharedModule { }
