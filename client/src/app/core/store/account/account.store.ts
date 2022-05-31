import { Injectable, NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AccountAPIEffects } from "./account.effects";
import { metaReducers } from "./account.state";
import { reducers } from "./account.state";
@NgModule({
    imports: [
        StoreModule.forFeature("[ACCOUNT]", reducers, { metaReducers }),
        EffectsModule.forFeature([AccountAPIEffects])
    ]
})
export class AccountStore { }