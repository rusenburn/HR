import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesModule } from './countries/countries.module';
import { RegionsModule } from './regions/regions.module';
import { NotFoundComponent } from '../shared/not-found.component';
import { HomeComponent } from './home/home.component';
import { DepartmentsModule } from './departments/departments.module';

const routes: Routes = [

  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "regions", loadChildren: () => RegionsModule },
  { path: "countries", loadChildren: () => CountriesModule },
  { path: "departments", loadChildren: () => DepartmentsModule,},
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
