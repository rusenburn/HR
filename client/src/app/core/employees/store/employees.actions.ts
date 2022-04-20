import { createAction, props } from "@ngrx/store";
import { EmployeeCreateModel } from "src/app/models/employees/employee-create.model";
import { EmployeeUpdateModel } from "src/app/models/employees/employee-update.model";
import { EmployeeModel } from "src/app/models/employees/employee.model";

export const readAll = createAction("[Employees] ReadAll");
export const createOne = createAction("[Employees] CreateOne", props<{ employee: EmployeeCreateModel }>());
export const updateOne = createAction("[Employees] UpdateOne", props<{ employee: EmployeeUpdateModel }>());
export const deleteOne = createAction("[Employees] DeleteOne", props<{ id: number }>());


// API ACTIONS
export const readAllSuccess = createAction("[Employees API] ReadAllSuccess",props<{employees:EmployeeModel[]}>());
export const readAllFailure = createAction("[Employees API] ReadAllFailure",props<{error:Error}>());

export const createOneSuccess = createAction("[Employees API] CreateOneSuccess",props<{employee:EmployeeModel}>())
export const createOneFailure = createAction("[Employees API] CreateOneSuccess",props<{error:Error}>())

export const updateOneSuccess = createAction("[Employees API] UpdateOneSuccess",props<{employee:EmployeeModel}>())
export const updateOneFailure = createAction("[Employees API] UpdateOneFailure",props<{error:Error}>())

export const deleteOneSuccess = createAction("[Employees API] DeleteOneSuccess",props<{employeeId:number}>())
export const deleteOneFailure = createAction("[Employees API] DeleteOneFailure",props<{error:Error}>())