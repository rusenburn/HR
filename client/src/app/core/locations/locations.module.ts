import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocationsRoutingModule } from './locations-routing.module';
import { LocationsApiEffects } from './store/locations.effects';
import { reducers as locationReducers } from "./store/locations.state";
import { metaReducers } from "./store/locations.state";


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    LocationsRoutingModule,
    StoreModule.forFeature("[LOCATIONS]", locationReducers, { metaReducers }),
    EffectsModule.forFeature([LocationsApiEffects])
  ]
})
export class LocationsModule { }
