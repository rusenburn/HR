import { NgModule } from '@angular/core';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { LocationsModule } from './locations/locations.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { JobsModule } from './jobs/jobs.module';
import { JobHistoriesModule } from './job-histories/job-histories.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';

const modules = [
  RegionsModule,
  CountriesModule,
  LocationsModule,
  DepartmentsModule,
  EmployeesModule,
  JobsModule,
  JobHistoriesModule,
  SharedModule
]

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    modules,
  ],
  exports: [
    modules
  ]
})
export class CoreModule { }
