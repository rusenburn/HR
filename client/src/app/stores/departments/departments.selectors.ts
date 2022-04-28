import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DepartmentLocationedModel } from "src/app/models/departments/department-locationed";
import { DepartmentsState } from "./departments.reducers";
import { DepartmentsSharedState } from "./departments.state";

const stringComparer = (a: string | null, b: string | null): number => {
    if (a && b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }
    if (b) return -1;
    if (a) return 1;
    return 0;
}


const _selectAllDepartments = (state: DepartmentsState) => state.departments;
const _selectLoading = (state: DepartmentsState) => state.loading;
const _selectDepartmentDetail = (state: DepartmentsState) => state.departmentDetail;

const _selectPageIndex = (state: DepartmentsState) => state.pageIndex;
const _selectPageSize = (state: DepartmentsState) => state.pageSize;
const _selectSortActive = (state: DepartmentsState) => state.sortActive;
const _selectAscending = (state: DepartmentsState) => state.ascending
const _selectByCountry = (state: DepartmentsState) => state.byCountry

const _sort = (departments: DepartmentLocationedModel[], sortActive: string, ascending: boolean): DepartmentLocationedModel[] => {
    const result = [...departments];
    switch (sortActive) {
        case "departmentId":
            result.sort((a, b) => a.departmentId - b.departmentId);
            break;
        case "departmentName":
            result.sort((a, b) => stringComparer(a.departmentName, b.departmentName));
            break
        case "locationId":
            result.sort((a, b) => a.locationId - b.locationId);
            break
        case "streetAddress":
            result.sort((a, b) => stringComparer(a.location.streetAddress, b.location.streetAddress));
            break;
        case "postalCode":
            result.sort((a, b) => stringComparer(a.location?.postalCode, b.location?.postalCode));
            break;
        case "city":
            result.sort((a, b) => stringComparer(a.location.city, b.location.city));
            break;
        case "stateProvince":
            result.sort((a, b) => stringComparer(a.location.stateProvince, b.location.stateProvince));
            break;
        case "countryId":
            result.sort((a, b) => a.location.countryId - b.location.countryId);
            break;
        default:
            result.sort((a, b) => a.departmentId - b.departmentId);
            break;
    }
    if (ascending) return result;
    return result.reverse();
}

const _slice = (departments: DepartmentLocationedModel[], pageIndex: number, pageSize: number): DepartmentLocationedModel[] => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const sl = departments.slice(start, end);
    return [...sl];
};


const _filterByCountryOrAll = (departments: DepartmentLocationedModel[], byCountry: number | null) => {
    if (!byCountry) {
        return departments;
    }
    const result = departments.filter(d => d.location.countryId === byCountry)
    return result;
};

export const selectSharedDepartmentsState = createFeatureSelector<DepartmentsSharedState>("[DEPARTMENTS]");

export const selectDepartmentsState = createSelector(
    selectSharedDepartmentsState,
    (sharedState) => sharedState.departments
);

export const selectAllDepartments = createSelector(
    selectDepartmentsState,
    _selectAllDepartments
);

export const selectLoading = createSelector(
    selectDepartmentsState,
    _selectLoading
);
export const selectDepartmentDetail = createSelector(
    selectDepartmentsState,
    _selectDepartmentDetail
);

export const selectPageIndex = createSelector(
    selectDepartmentsState,
    _selectPageIndex
);

export const selectPageSize = createSelector(
    selectDepartmentsState,
    _selectPageSize
);

export const selectSortActive = createSelector(
    selectDepartmentsState,
    _selectSortActive
);
export const selectAscending = createSelector(
    selectDepartmentsState,
    _selectAscending
);
export const selectByCountry = createSelector(
    selectDepartmentsState,
    _selectByCountry
);

export const selectCountryDepartmentsOrAll = createSelector(
    selectAllDepartments,
    selectByCountry,
    _filterByCountryOrAll
);

export const selectSortedCountryDepartments = createSelector(
    selectCountryDepartmentsOrAll,
    selectSortActive,
    selectAscending,
    _sort
);

export const selectSortedCountryDepartmentsSlice = createSelector(
    selectSortedCountryDepartments,
    selectPageIndex,
    selectPageSize,
    _slice
);

export const selectAllDepartmentsLength = createSelector(
    selectAllDepartments,
    (departments) => departments.length
);
export const selectCountryDepartmentsOrAllLength = createSelector(
    selectCountryDepartmentsOrAll,
    (departments) => departments.length
);




