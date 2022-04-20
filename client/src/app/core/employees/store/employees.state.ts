import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { EmployeesState } from "./employees.reducer";
import { reducer as employeesReducer } from "./employees.reducer";

export interface EmployeesSharedState {
    employees: EmployeesState
}

export const reducers: ActionReducerMap<EmployeesSharedState> = {
    employees: employeesReducer
};
export const metaReducers: MetaReducer<EmployeesSharedState>[] = [];