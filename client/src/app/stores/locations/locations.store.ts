import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { LocationsApiEffects } from "./locations.effects";
import { reducers, metaReducers } from "./locations.state";

@NgModule({
    imports: [
        StoreModule.forFeature("[LOCATIONS]", reducers, { metaReducers }),
        EffectsModule.forFeature([LocationsApiEffects])
    ]
})
export class LocationStore { }