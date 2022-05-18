import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { DepartmentsAPIEffects, DepartmentsFormEffects } from "./departments.effects";
import { metaReducers, reducers } from "./departments.state";

@NgModule({
    imports:[
        StoreModule.forFeature("[DEPARTMENTS]",reducers,{metaReducers}),
        EffectsModule.forFeature([DepartmentsAPIEffects,DepartmentsFormEffects])
    ]
})
export class DepartmentsStore{

}
