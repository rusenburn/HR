import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { CountriesApiEffects } from "./countries.effects";
import { metaReducers, reducers } from "./countries.state";

@NgModule({
    imports: [
        StoreModule.forFeature("[COUNTRIES]", reducers, { metaReducers }),
        EffectsModule.forFeature([CountriesApiEffects]),
    ]
})
export class CountriesStore { }