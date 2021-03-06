import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../shared/not-found.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [

  { path: "home", loadChildren: () => import('../modules/home/home.module').then(m => m.HomeModule),canActivate:[AuthGuard]},
  { path: "regions", loadChildren: () => import('../modules/regions/regions.module').then(m => m.RegionsModule) ,canActivate: [AuthGuard] },
  { path: "countries", loadChildren: () => import('../modules/countries/countries.module').then(m => m.CountriesModule) ,canActivate: [AuthGuard]},
  { path: "departments", loadChildren: () => import("../modules/departments/departments.module").then(m => m.DepartmentsModule) ,canActivate: [AuthGuard]},
  { path: "jobs", loadChildren: () => import("../modules/jobs/jobs.module").then(m => m.JobsModule) ,canActivate: [AuthGuard]},
  { path: "employees", loadChildren: () => import("../modules/employees/employees.module").then(m => m.EmployeesModule) ,canActivate: [AuthGuard]},
  { path: "job-history", loadChildren: () => import("../modules/job-history/job-history.module").then(m => m.JobHistoryModule) ,canActivate: [AuthGuard]},
  { path: "account", loadChildren: () => import("../modules/account/account.module").then(m => m.AccountModule) },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "index", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
