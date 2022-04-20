import { createReducer, on } from "@ngrx/store";
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
    error: Error | null
}

const initialState: EmployeesState = {
    employees: [],
    loading: false,
    error: null
};

export const reducer = createReducer(initialState,
    on(EmployeesActions.readAll,
        EmployeesActions.createOne,
        EmployeesActions.deleteOne,
        EmployeesActions.updateOne,
        (state) => {
            return { ...state, loading: true };
        }),
    on(EmployeesActions.readAllFailure,
        EmployeesActions.deleteOneFailure,
        EmployeesActions.createOneFailure,
        EmployeesActions.updateOneFailure,
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
);