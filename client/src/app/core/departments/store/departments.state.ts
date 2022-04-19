import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { DepartmentsState } from "./departments.reducers";
import { reducer as departmentsReducer } from "./departments.reducers";

export interface DepartmentsSharedState{
    departments:DepartmentsState
}

export const reducers:ActionReducerMap<DepartmentsSharedState>={
    departments:departmentsReducer
};

export const metaReducers:MetaReducer<DepartmentsSharedState>[]=[];