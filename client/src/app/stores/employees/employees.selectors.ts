import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EmployeeFilterModel } from "src/app/models/employees/employee-filter.model";
import { EmployeeModel } from "src/app/models/employees/employee.model";
import { EmployeesState } from "./employees.reducer";
import { EmployeesSharedState } from "./employees.state";

const stringComparer = (a: string | null, b: string | null): number => {
    if (a && b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }
    if (b) return -1;
    if (a) return 1;
    return 0;
};

const _selectAllEmployees = (state: EmployeesState) => state.employees;
const _selectLoading = (state: EmployeesState) => state.loading;
const _selectEmployeeDetail = (state: EmployeesState) => state.employeeDetail;
const _selectPageIndex = (state: EmployeesState) => state.pageIndex;
const _selectPageSize = (state: EmployeesState) => state.pageSize;
const _selectSortActive = (state: EmployeesState) => state.sortActive;
const _selectAscending = (state: EmployeesState) => state.ascending;
const _selectfilter = (state: EmployeesState) => state.filters;

const _sort = (employees: EmployeeModel[], sortActive: string, ascending: boolean): EmployeeModel[] => {
    const result = [...employees];
    switch (sortActive) {
        case "employeeId":
            result.sort((a, b) => a.employeeId - b.employeeId);
            break;
        case "firstName":
            result.sort((a, b) => stringComparer(a.firstName + " " + a.lastName, b.firstName + " " + b.lastName));
            break;
        case "lastName":
            result.sort((a, b) => stringComparer(a.lastName + " " + a.firstName, b.lastName + " " + b.firstName));
            break;
        case "email":
            result.sort((a, b) => stringComparer(a.email, b.email));
            break;
        case "phoneNumber":
            result.sort((a, b) => stringComparer(a.phoneNumber, b.phoneNumber));
            break;
            // case "hireDate":
            //     result.sort((a,b)=>stringComparer(a.hireDate,b.hireDate));
            break;
        case "jobId":
            result.sort((a, b) => (a.jobId || 0) - (b.jobId || 0));
            break;
        case "managerId":
            result.sort((a, b) => (a.managerId || 0) - (b.managerId || 0));
            break;
        case "departmentId":
            result.sort((a, b) => (a.departmentId ?? 0) - (b.departmentId ?? 0));
            break;
        default:
            result.sort((a, b) => a.employeeId - b.employeeId);
            break;
    }
    if (ascending) return result;
    return result.reverse();
};

const _slice = (employees: EmployeeModel[], pageIndex: number, pageSize: number): EmployeeModel[] => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const sl = employees.slice(start, end);
    return [...sl];
};

const _filterByKeys = (employees: EmployeeModel[], employeeFilter: EmployeeFilterModel): EmployeeModel[] => {
    if (!employeeFilter.departmentId && !employeeFilter.jobId && !employeeFilter.managerId) {
        console.log(employeeFilter.managerId);
        return employees;
    };
    let result = [...employees];
    if (employeeFilter.departmentId) {
        result = result.filter(e => e.departmentId === employeeFilter.departmentId);
    }
    if (employeeFilter.jobId) {
        result = result.filter(e => e.jobId === employeeFilter.jobId);
    }
    if (employeeFilter.managerId) {
        console.log(employeeFilter.managerId);
        result = result.filter(e => e.managerId === employeeFilter.managerId);
    }
    return result;
};

export const selectSharedEmployeesState = createFeatureSelector<EmployeesSharedState>("[EMPLOYEES]");

export const selectEmployeesState = createSelector(
    selectSharedEmployeesState,
    (sharedState) => sharedState.employees
);
export const selectAllEmployees = createSelector(
    selectEmployeesState,
    _selectAllEmployees
);

export const selectLoading = createSelector(
    selectEmployeesState,
    _selectLoading
);

export const selectEmployeeDetail = createSelector(
    selectEmployeesState,
    _selectEmployeeDetail
);

export const selectPageIndex = createSelector(
    selectEmployeesState,
    _selectPageIndex
);

export const selectPageSize = createSelector(
    selectEmployeesState,
    _selectPageSize
);

export const selectSortActive = createSelector(
    selectEmployeesState,
    _selectSortActive
);

export const selectAscending = createSelector(
    selectEmployeesState,
    _selectAscending
);

export const selectFilter = createSelector(
    selectEmployeesState,
    _selectfilter
);

export const selectFilteredEmployees = createSelector(
    selectAllEmployees,
    selectFilter,
    _filterByKeys
);

export const selectSortedEmployees = createSelector(
    selectFilteredEmployees,
    selectSortActive,
    selectAscending,
    _sort
);

export const selectFilteredEmployeesLength = createSelector(
    selectFilteredEmployees,
    (employees) => employees.length
);


export const selectSortedEmployeesSlice = createSelector(
    selectSortedEmployees,
    selectPageIndex,
    selectPageSize,
    _slice
);