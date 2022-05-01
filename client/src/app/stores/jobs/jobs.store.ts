import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { JobsEffects, JobsFormEffects } from "./jobs.effects";
import { metaReducers, reducers } from "./jobs.state";

@NgModule({
    imports:[
        StoreModule.forFeature("[JOBS]",reducers,{metaReducers}),
        EffectsModule.forFeature([JobsEffects,JobsFormEffects])
    ]})
export class JobsStore{}