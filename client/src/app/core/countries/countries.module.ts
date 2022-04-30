import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CountriesRoutingModule } from './countries-routing.module';
import { IndexComponent } from './index/index.component';
import { CountryDetailComponent } from './country-detail/country-detail.component';


@NgModule({
  declarations: [
    IndexComponent,
    // CountryUpsertDialogComponent,
    CountryDetailComponent
  ],
  imports: [
    SharedModule,
    CountriesRoutingModule,
  ]
})
export class CountriesModule { }
