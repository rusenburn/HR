import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { JobsEffects } from "./jobs.effects";
import { metaReducers, reducers } from "./jobs.state";

@NgModule({
    imports:[
        StoreModule.forFeature("[JOBS]",reducers,{metaReducers}),
        EffectsModule.forFeature([JobsEffects])
    ]})
export class JobsStore{}