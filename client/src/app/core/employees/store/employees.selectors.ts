import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EmployeesState } from "./employees.reducer";
import { EmployeesSharedState } from "./employees.state";


const _selectAllEmployees = (state: EmployeesState) => state.employees;
const _selectLoading = (state: EmployeesState) => state.loading;

export const selectSharedEmployeesState = createFeatureSelector<EmployeesSharedState>("[EMPLOYEES]");

export const selectEmployeesState = createSelector(
    selectSharedEmployeesState,
    (sharedState) => sharedState.employees
)
export const selectAllEmployees = createSelector(
    selectEmployeesState,
    _selectAllEmployees
)

export const selectLoading = createSelector(
    selectEmployeesState,
    _selectLoading
)