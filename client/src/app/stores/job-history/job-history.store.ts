import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { JobHistoryAPIEffects } from "./job-history.effects";
import { metaReducers, reducers } from "./job-history.state";

@NgModule({
    imports: [
        StoreModule.forFeature("[JOBHISTORY]", reducers, { metaReducers }),
        EffectsModule.forFeature([JobHistoryAPIEffects])
    ]
})
export class JobHisotryStore{}