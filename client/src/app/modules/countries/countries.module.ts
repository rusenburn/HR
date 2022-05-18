import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountriesRoutingModule } from './countries-routing.module';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { IndexComponent } from './index/index.component';



@NgModule({
  declarations: [
    IndexComponent,
    CountryDetailComponent
  ],
  imports: [
    SharedModule,
    CountriesRoutingModule,
  ]
})
export class CountriesModule { }
