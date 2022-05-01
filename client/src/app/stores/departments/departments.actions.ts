import { createAction, props } from "@ngrx/store";
import { DepartmentCreateModel } from "src/app/models/departments/department-create.model";
import { DepartmentDetailModel } from "src/app/models/departments/department-detail.model";
import { DepartmentLocationedModel } from "src/app/models/departments/department-locationed";
import { DepartmentQueryModel } from "src/app/models/departments/department-query.model";
import { DepartmentUpdateModel } from "src/app/models/departments/department-update.model";
import { DepartmentModel } from "src/app/models/departments/department.model";
import { LocationCreateModel } from "src/app/models/locations/location-create.model";
import { LocationUpdateModel } from "src/app/models/locations/location-update.model";
import { LocationModel } from "src/app/models/locations/location.model";

export const readAll = createAction("[DEPARTMENTS] ReadAll", props<DepartmentQueryModel>());
export const createOne = createAction("[DEPARTMENTS] CreateOne", props<{ department: DepartmentCreateModel, location: LocationCreateModel }>());
export const updateOne = createAction("[DEPARTMENTS] UpdateOne", props<{ department: DepartmentUpdateModel, location: LocationUpdateModel }>());
export const deleteOne = createAction("[DEPARTMENTS] DeleteOne", props<{ departmentId: number }>());
export const createOneWithLocation = createAction("[DEPARTMENTS] CreateOneWithLocation", props<{ department: DepartmentCreateModel, location: LocationCreateModel }>());

export const updatePagination = createAction("[DEPARTMENTS] UpdatePagination", props<{ pageIndex: number, pageSize: number }>());
export const updateSorting = createAction("[DEPARTMENTS] UpdateSorting", props<{ active: string, asc: boolean }>());

export const setCountryFilter = createAction("[DEPARTMENTS] setCountryFilter", props<{ countryId: number | null }>());
export const clearCountryFilter = createAction("[DEPARTMENTS] clearCountryFilter");
// PARAM ACTIONS
export const readOne = createAction("[DEPARTMENTS PARAM] ReadOne", props<{ departmentId: number }>());

// API ACTIONS

export const readAllSuccess = createAction("[DEPARTMENTS API] ReadAllSuccess", props<{ departments: DepartmentModel[], locations: LocationModel[] }>());
export const readAllFailure = createAction("[DEPARTMENTS API] ReadAllFailure", props<{ error: Error }>());

export const createOneSuccess = createAction("[DEPARTMENTS API] CreateOneSuccess", props<{ department: DepartmentModel, location: LocationModel }>())
export const createOneFailure = createAction("[DEPARTMENTS API] CreateOneSuccess", props<{ error: Error }>())

export const updateOneSuccess = createAction("[DEPARTMENTS API] UpdateOneSuccess", props<{ department: DepartmentModel, location: LocationModel }>())
export const updateOneFailure = createAction("[DEPARTMENTS API] UpdateOneFailure", props<{ error: Error }>())

export const deleteOneSuccess = createAction("[DEPARTMENTS API] DeleteOneSuccess", props<{ departmentId: number }>())
export const deleteOneFailure = createAction("[DEPARTMENTS API] DeleteOneFailure", props<{ error: Error }>())

export const readOneSuccess = createAction("[DEPARTMENTS API] ReadOneSuccess", props<{ department: DepartmentDetailModel }>());
export const readOneFailure = createAction("[DEPARTMENTS API] ReadOneFailure", props<{ error: Error }>());


// FORM ACTIONS
export const openForm = createAction("[DEPARTMENTS FORM] OpenForm",props<{department:DepartmentLocationedModel|null}>());
export const openFormSuccess = createAction("[DEPARTMENTS OpenFormSuccess]",props<{formId:string}>());
export const closeForm = createAction("[DEPARTMENTS FORM] CloseForm",props<{formId:string}>());
export const closeFormSuccess = createAction("[DEPARTMENTS FORM] CloseFormSuccess");