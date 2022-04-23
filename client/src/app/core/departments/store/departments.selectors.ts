import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DepartmentsState } from "./departments.reducers";
import { DepartmentsSharedState } from "./departments.state";


const _selectAllDepartments = (state:DepartmentsState)=>state.departments;
const _selectLoading = (state:DepartmentsState)=>state.loading;

export const selectSharedDepartmentsState = createFeatureSelector<DepartmentsSharedState>("[DEPARTMENTS]");

export const selectDepartmentsState = createSelector(
    selectSharedDepartmentsState,
    (sharedState)=>sharedState.departments
);

export const selectAllDepartmets = createSelector(
    selectDepartmentsState,
    _selectAllDepartments
);

export const selectLoading = createSelector(
    selectDepartmentsState,
    _selectLoading
);