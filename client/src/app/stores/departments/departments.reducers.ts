import { createReducer, on } from "@ngrx/store";
import { DepartmentDetailModel } from "src/app/models/departments/department-detail.model";
import { DepartmentLocationedModel } from "src/app/models/departments/department-locationed";
import { LocationModel } from "src/app/models/locations/location.model";
import * as DepartmentsActions from "./departments.actions";


const cloneArrayWithUpdatedItem = function (departments: DepartmentLocationedModel[], department: DepartmentLocationedModel): DepartmentLocationedModel[] {
    let temp = [...departments];
    let i = temp.findIndex((c) => c.departmentId === department.departmentId);
    temp.splice(i, 1, ...[department]);
    return temp;
}
export interface DepartmentsState {
    departments: DepartmentLocationedModel[];
    loading: boolean;
    error: Error | null;
    departmentDetail: DepartmentDetailModel | null;
    pageIndex: number;
    pageSize: number;
    sortActive: string;
    ascending: boolean;
    byCountry: number | null;
    formId: string
}

const initialState: DepartmentsState = {
    departments: [],
    loading: false,
    error: null,
    departmentDetail: null,
    pageIndex: 0,
    pageSize: 10,
    sortActive: "departmentId",
    ascending: true,
    byCountry: null,
    formId: ""
};

export const reducer = createReducer(
    initialState,
    on(DepartmentsActions.readAll,
        DepartmentsActions.createOne,
        DepartmentsActions.updateOne,
        DepartmentsActions.deleteOne,
        (state) => {
            return { ...state, loading: true };
        }),
    on(DepartmentsActions.updatePagination, (state, action) => {
        return { ...state, pageIndex: action.pageIndex, pageSize: action.pageSize };
    }),
    on(DepartmentsActions.updateSorting, (state, action) => {
        return { ...state, ascending: action.asc, sortActive: action.active };
    }),
    on(DepartmentsActions.setCountryFilter, (state, action) => {
        return { ...state, byCountry: action.countryId };
    }),
    on(DepartmentsActions.clearCountryFilter, (state) => {
        return { ...state, byCountry: null };
    }),
    on(DepartmentsActions.createOneFailure,
        DepartmentsActions.readAllFailure,
        DepartmentsActions.deleteOneFailure,
        DepartmentsActions.updateOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error }
        }),
    on(DepartmentsActions.readAllSuccess,
        (state, action) => {
            const dict = new Map<number, LocationModel>();
            action.locations.forEach((l) => dict.set(l.locationId, l));
            const departments: DepartmentLocationedModel[] = [];
            // const departments = action.departments.map<DepartmentLocationedModel>(d=>{return {...d,location:dict[d.locationId]}})
            action.departments.forEach(d => departments.push({ ...d, location: dict.get(d.locationId) as LocationModel }));
            return { ...state, loading: false, departments }
        }),
    on(DepartmentsActions.createOneSuccess,
        (state, action) => {
            const department: DepartmentLocationedModel = { ...action.department, location: action.location };
            return { ...state, loading: false, departments: [...state.departments, department] };
        }),
    on(DepartmentsActions.updateOneSuccess,
        (state, action) => {
            const department: DepartmentLocationedModel = { ...action.department, location: action.location };
            const departments = cloneArrayWithUpdatedItem(state.departments, department);
            return { ...state, loading: false, departments };
        }),
    on(DepartmentsActions.deleteOneSuccess,
        (state, action) => {
            const departments = [...state.departments];
            const index = departments.findIndex(d => d.departmentId === action.departmentId);
            departments.splice(index, 1);
            return { ...state, loading: false, departments }
        }),
    on(DepartmentsActions.readOneSuccess,
        (state, action) => {
            return { ...state, loading: false, departmentDetail: action.department }
        }),
    on(DepartmentsActions.openFormSuccess, (state, action) => {
        return { ...state, formId: action.formId };
    }),
    on(DepartmentsActions.closeFormSuccess, (state) => {
        return { ...state, formId: "" };
    })
)