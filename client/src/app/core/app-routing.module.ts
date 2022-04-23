import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesModule } from './countries/countries.module';
import { RegionsModule } from './regions/regions.module';
import { NotFoundComponent } from '../shared/not-found.component';
import { HomeComponent } from './home/home.component';
import { DepartmentsModule } from './departments/departments.module';
import { JobsModule } from './jobs/jobs.module';
import { EmployeesModule } from './employees/employees.module';
import { JobHistoryModule } from './job-history/job-history.module';

const routes: Routes = [

  { path: "home", component: HomeComponent },
  { path: "regions", loadChildren: () => RegionsModule },
  { path: "countries", loadChildren: () => CountriesModule },
  { path: "departments", loadChildren: () => DepartmentsModule, },
  { path: "jobs", loadChildren: () => JobsModule, },
  { path: "employees", loadChildren: () => EmployeesModule, },
  { path: "job-history", loadChildren: () => JobHistoryModule, },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
