import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/not-found.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [

  { path: "home", component: HomeComponent },
  { path: "regions", loadChildren: () => import('./regions/regions.module').then(m => m.RegionsModule) },
  { path: "countries", loadChildren: () => import('./countries/countries.module').then(m=>m.CountriesModule) },
  { path: "departments", loadChildren: () => import("./departments/departments.module").then(m=>m.DepartmentsModule) },
  { path: "jobs", loadChildren: () => import("./jobs/jobs.module").then(m=>m.JobsModule) },
  { path: "employees", loadChildren: () => import("./employees/employees.module").then(m=>m.EmployeesModule) },
  { path: "job-history", loadChildren: () => import("./job-history/job-history.module").then(m=>m.JobHistoryModule) },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
