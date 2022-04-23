import { NgModule } from '@angular/core';
import { RegionsModule } from './regions/regions.module';
import { CountriesModule } from './countries/countries.module';
import { LocationsModule } from './locations/locations.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { JobsModule } from './jobs/jobs.module';
import { JobHistoryModule } from './job-history/job-history.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';

const modules = [
  RegionsModule,
  CountriesModule,
  LocationsModule,
  DepartmentsModule,
  EmployeesModule,
  JobsModule,
  JobHistoryModule,
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
    // TODO mb we need to remove this
    modules
  ]
})
export class CoreModule { }
