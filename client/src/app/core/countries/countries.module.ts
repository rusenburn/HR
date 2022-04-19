import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../../shared/shared.module';
import { CountriesRoutingModule } from './countries-routing.module';
import { CountriesApiEffects } from './store/countries.effects';
import * as CountryState from "./store/countries.state";
import { IndexComponent } from './index/index.component';
import { CountryUpsertDialogComponent } from './country-upsert-dialog/country-upsert-dialog.component';


@NgModule({
  declarations: [
    IndexComponent,
    CountryUpsertDialogComponent
  ],
  imports: [
    SharedModule,
    CountriesRoutingModule,
    StoreModule.forFeature("[COUNTRIES]", CountryState.reducers, { metaReducers: CountryState.metaReducers }),
    EffectsModule.forFeature([CountriesApiEffects])
  ]
})
export class CountriesModule { }
