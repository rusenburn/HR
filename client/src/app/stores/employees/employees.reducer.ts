import { createReducer, on } from "@ngrx/store";
import { EmployeeDetailModel } from "src/app/models/employees/employee-detail.model";
import { defaultEmployeeFilter, EmployeeFilterModel } from "src/app/models/employees/employee-filter.model";
import { EmployeeModel } from "src/app/models/employees/employee.model";
import * as EmployeesActions from "./employees.actions";


const cloneArrayWithUpdatedItem = function (employees: EmployeeModel[], employee: EmployeeModel): EmployeeModel[] {
    const temp = [...employees];
    const i = temp.findIndex((c) => c.employeeId === employee.employeeId);
    temp.splice(i, 1, ...[employee]);
    return temp;
}

export interface EmployeesState {
    employees: EmployeeModel[],
    loading: boolean,
    error: Error | null,
    employeeDetail: EmployeeDetailModel | null,
    pageIndex: number,
    pageSize: number,
    sortActive: string,
    ascending: boolean,
    filters: EmployeeFilterModel,
    formId: string

}

const initialState: EmployeesState = {
    employees: [],
    loading: false,
    error: null,
    employeeDetail: null,
    pageIndex: 0,
    pageSize: 10,
    sortActive: "employeeId",
    ascending: true,
    filters: { ...defaultEmployeeFilter },
    formId: ""
};

export const reducer = createReducer(initialState,
    on(EmployeesActions.readAll,
        EmployeesActions.createOne,
        EmployeesActions.deleteOne,
        EmployeesActions.updateOne,
        EmployeesActions.readOne,
        (state) => {
            return { ...state, loading: true };
        }),
    on(EmployeesActions.readAllFailure,
        EmployeesActions.deleteOneFailure,
        EmployeesActions.createOneFailure,
        EmployeesActions.updateOneFailure,
        EmployeesActions.readOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error };
        }),
    on(EmployeesActions.readAllSuccess, (state, action) => {
        return { ...state, loading: false, employees: action.employees }
    }),
    on(EmployeesActions.createOneSuccess, (state, action) => {
        return { ...state, loading: false, employees: [...state.employees, action.employee] }
    }),
    on(EmployeesActions.updateOneSuccess, (state, action) => {
        const employees = cloneArrayWithUpdatedItem(state.employees, action.employee);
        return { ...state, loading: false, employees }
    }),
    on(EmployeesActions.deleteOneSuccess, (state, action) => {
        const employees = [...state.employees]
        const index = employees.findIndex(c => c.employeeId === action.employeeId);
        employees.splice(index, 1);
        return { ...state, loading: false, employees }
    }),
    on(EmployeesActions.readOneSuccess, (state, action) => {
        return { ...state, loading: false, employeeDetail: action.employeeDetail };
    }),
    on(EmployeesActions.updatePagination, (state, action) => {
        return { ...state, pageIndex: action.pageIndex, pageSize: action.pageSize };
    }),
    on(EmployeesActions.updateSorting, (state, action) => {
        return { ...state, sortActive: action.sortActive, ascending: action.asc };
    }),
    on(EmployeesActions.setFilters, (state, action) => {
        return { ...state, filters: { ...action.filters } };
    }),
    on(EmployeesActions.removeFilters, (state) => {
        return { ...state, filters: { ...defaultEmployeeFilter } }
    }),
    on(EmployeesActions.openFormSuccess, (state, action) => {
        return { ...state, formId: action.formId };
    }),
    on(EmployeesActions.closeFormSuccess, (state) => {
        return { ...state, formId: "" };
    })
);