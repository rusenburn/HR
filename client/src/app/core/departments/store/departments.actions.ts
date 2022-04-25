import { createAction, props } from "@ngrx/store";
import { DepartmentCreateModel } from "src/app/models/departments/department-create.model";
import { DepartmentDetailModel } from "src/app/models/departments/department-detail.model";
import { DepartmentUpdateModel } from "src/app/models/departments/department-update.model";
import { DepartmentModel } from "src/app/models/departments/department.model";
import { LocationCreateModel } from "src/app/models/locations/location-create.model";
import { LocationUpdateModel } from "src/app/models/locations/location-update.model";
import { LocationModel } from "src/app/models/locations/location.model";

export const readAll = createAction("[DEPARTMENTS] ReadAll");
export const createOne = createAction("[DEPARTMENTS] CreateOne", props<{ department: DepartmentCreateModel,location:LocationCreateModel }>());
export const updateOne = createAction("[DEPARTMENTS] UpdateOne", props<{ department: DepartmentUpdateModel,location:LocationUpdateModel }>());
export const deleteOne = createAction("[DEPARTMENTS] DeleteOne", props<{ departmentId: number }>());
export const createOneWithLocation = createAction("[DEPARTMENTS] CreateOneWithLocation",props<{department:DepartmentCreateModel,location:LocationCreateModel}>());

// PARAM ACTIONS
export const readOne = createAction("[DEPARTMENTS PARAM] ReadOne",props<{departmentId:number}>());

// API ACTIONS

export const readAllSuccess = createAction("[DEPARTMENTS API] ReadAllSuccess",props<{departments:DepartmentModel[],locations:LocationModel[]}>());
export const readAllFailure = createAction("[DEPARTMENTS API] ReadAllFailure",props<{error:Error}>());

export const createOneSuccess = createAction("[DEPARTMENTS API] CreateOneSuccess",props<{department:DepartmentModel,location:LocationModel}>())
export const createOneFailure = createAction("[DEPARTMENTS API] CreateOneSuccess",props<{error:Error}>())

export const updateOneSuccess = createAction("[DEPARTMENTS API] UpdateOneSuccess",props<{department:DepartmentModel,location:LocationModel}>())
export const updateOneFailure = createAction("[DEPARTMENTS API] UpdateOneFailure",props<{error:Error}>())

export const deleteOneSuccess = createAction("[DEPARTMENTS API] DeleteOneSuccess",props<{departmentId:number}>())
export const deleteOneFailure = createAction("[DEPARTMENTS API] DeleteOneFailure",props<{error:Error}>())

export const readOneSuccess = createAction("[DEPARTMENTS API] ReadOneSuccess",props<{department:DepartmentDetailModel}>());
export const readOneFailure = createAction("[DEPARTMENTS API] ReadOneFailure",props<{error:Error}>());