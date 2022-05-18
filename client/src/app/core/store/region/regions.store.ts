import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { RegionsApiEffects } from "./regions.effects";
import { reducers, metaReducers } from "./regions.state";
@NgModule({
    imports: [
        StoreModule.forFeature("[REGIONS]", reducers, { metaReducers }),
        EffectsModule.forFeature([RegionsApiEffects]),
    ],
})
export class RegionsStore { }