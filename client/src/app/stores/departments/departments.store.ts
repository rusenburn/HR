import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { DepartmentsAPIEffects } from "./departments.effects";
import { metaReducers, reducers } from "./departments.state";

@NgModule({
    imports:[
        StoreModule.forFeature("[DEPARTMENTS]",reducers,{metaReducers}),
        EffectsModule.forFeature([DepartmentsAPIEffects])
    ]
})
export class DepartmentsStore{

}
