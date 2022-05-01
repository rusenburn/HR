import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { EmployeesAPIEffects, EmployeesFormEffects } from "./employees.effect";
import { metaReducers, reducers } from "./employees.state";

@NgModule({
    imports: [
        StoreModule.forFeature("[EMPLOYEES]", reducers, { metaReducers }),
        EffectsModule.forFeature([EmployeesAPIEffects,EmployeesFormEffects])
    ]})
export class EmployeeStore{}