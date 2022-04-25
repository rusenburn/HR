import { createAction, props } from "@ngrx/store";
import { JobHistoryCreateModel } from "src/app/models/job-histories/job-history-create.model";
import { JobHistoryDetailModel } from "src/app/models/job-histories/job-history-detail.model";
import { JobHistoryUpdateModel } from "src/app/models/job-histories/job-history-update";

export const readAll = createAction("[JobHistory] ReadAll");
export const createOne = createAction("[JobHistory] CreateOne", props<{ jobHistory: JobHistoryCreateModel }>());
export const updateOne = createAction("[JobHistory] UpdateOne", props<{ jobHistory: JobHistoryUpdateModel }>());
export const deleteOne = createAction("[JobHistory] DeleteOne", props<{ employeeId: number,startDate:string }>());


// API ACTIONS
export const readAllSuccess = createAction("[JobHistory API] ReadAllSuccess", props<{ jobHistoryList: JobHistoryDetailModel[] }>());
export const readAllFailure = createAction("[JobHistory API] ReadAllFailure", props<{ error: Error }>());

export const createOneSuccess = createAction("[JobHistory API] CreateOneSuccess", props<{ jobHistory: JobHistoryDetailModel }>())
export const createOneFailure = createAction("[JobHistory API] CreateOneSuccess", props<{ error: Error }>())

export const updateOneSuccess = createAction("[JobHistory API] UpdateOneSuccess", props<{ jobHistory: JobHistoryDetailModel }>())
export const updateOneFailure = createAction("[JobHistory API] UpdateOneFailure", props<{ error: Error }>())

export const deleteOneSuccess = createAction("[JobHistory API] DeleteOneSuccess", props<{ employeeId: number,startDate:string }>());
export const deleteOneFailure = createAction("[JobHistory API] DeleteOneFailure", props<{ error: Error }>());