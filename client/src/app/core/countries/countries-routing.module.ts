import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  { path: "index", component: IndexComponent },
  { path: ":countryId", component: CountryDetailComponent },
  { path: "", redirectTo: "index", pathMatch: "full" },
]

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountriesRoutingModule { }
