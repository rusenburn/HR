import { createAction, props } from "@ngrx/store";
import { EmployeeCreateModel } from "src/app/models/employees/employee-create.model";
import { EmployeeDetailModel } from "src/app/models/employees/employee-detail.model";
import { EmployeeFilterModel } from "src/app/models/employees/employee-filter.model";
import { EmployeeQueryModel } from "src/app/models/employees/employee-query.model";
import { EmployeeUpdateModel } from "src/app/models/employees/employee-update.model";
import { EmployeeModel } from "src/app/models/employees/employee.model";

export const readAll = createAction("[EMPLOYEES] ReadAll", props<EmployeeQueryModel>());
export const createOne = createAction("[EMPLOYEES] CreateOne", props<{ employee: EmployeeCreateModel }>());
export const updateOne = createAction("[EMPLOYEES] UpdateOne", props<{ employee: EmployeeUpdateModel }>());
export const deleteOne = createAction("[EMPLOYEES] DeleteOne", props<{ id: number }>());

export const updatePagination = createAction("[EMPLOYEES] UpdatePagination", props<{ pageIndex: number, pageSize: number }>());
export const updateSorting = createAction("[EMPLOYEES] updateSorting", props<{ sortActive: string, asc: boolean }>());

export const setFilters = createAction("[EMPLOYEES] SetFilters", props<{ filters: EmployeeFilterModel }>());
export const removeFilters = createAction("[EMPLOYEES] removeFilters");

// Route
export const readOne = createAction("[EMPLOYEES ROUTE] ReadOne", props<{ employeeId: number }>());

// API ACTIONS
export const readAllSuccess = createAction("[EMPLOYEES API] ReadAllSuccess", props<{ employees: EmployeeModel[] }>());
export const readAllFailure = createAction("[EMPLOYEES API] ReadAllFailure", props<{ error: Error }>());

export const createOneSuccess = createAction("[EMPLOYEES API] CreateOneSuccess", props<{ employee: EmployeeModel }>());
export const createOneFailure = createAction("[EMPLOYEES API] CreateOneSuccess", props<{ error: Error }>());

export const updateOneSuccess = createAction("[EMPLOYEES API] UpdateOneSuccess", props<{ employee: EmployeeModel }>());
export const updateOneFailure = createAction("[EMPLOYEES API] UpdateOneFailure", props<{ error: Error }>());

export const deleteOneSuccess = createAction("[EMPLOYEES API] DeleteOneSuccess", props<{ employeeId: number }>());
export const deleteOneFailure = createAction("[EMPLOYEES API] DeleteOneFailure", props<{ error: Error }>());

export const readOneSuccess = createAction("[EMPLOYEES API] ReadOneSuccess", props<{ employeeDetail: EmployeeDetailModel }>());
export const readOneFailure = createAction("[EMPLOYEES API] ReadOneFailure", props<{ error: Error }>());


// FORM ACTIONS

export const openForm = createAction("[EMPLOYEES FORM] OpenForm", props<{ employee: EmployeeUpdateModel | null }>());
export const openFormSuccess = createAction("[EMPLOYEES FORM] OpenFormSuccess", props<{formId:string}>());
export const closeForm = createAction("[EMPLOYEES FORM] CloseForm", props<{ formId:string}>());
export const closeFormSuccess = createAction("[EMPLOYEES FORM] CloseFormSuccess");