import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/not-found.component';

const routes: Routes = [

  { path: "home", loadChildren:()=>import('../modules/home/home.module').then(m=>m.HomeModule) },
  { path: "regions", loadChildren: () => import('../modules/regions/regions.module').then(m => m.RegionsModule) },
  { path: "countries", loadChildren: () => import('../modules/countries/countries.module').then(m=>m.CountriesModule) },
  { path: "departments", loadChildren: () => import("../modules/departments/departments.module").then(m=>m.DepartmentsModule) },
  { path: "jobs", loadChildren: () => import("../modules/jobs/jobs.module").then(m=>m.JobsModule) },
  { path: "employees", loadChildren: () => import("../modules/employees/employees.module").then(m=>m.EmployeesModule) },
  { path: "job-history", loadChildren: () => import("../modules/job-history/job-history.module").then(m=>m.JobHistoryModule) },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "index", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
