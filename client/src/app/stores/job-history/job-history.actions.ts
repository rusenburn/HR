import { createAction, props } from "@ngrx/store";
import { JobHistoryCreateModel } from "src/app/models/job-histories/job-history-create.model";
import { JobHistoryDetailModel } from "src/app/models/job-histories/job-history-detail.model";
import { JobHistoryFilterModel } from "src/app/models/job-histories/job-history-filter.model";
import { JobHistoryUpdateModel } from "src/app/models/job-histories/job-history-update";

export const readAll = createAction("[JOBHISTORY] ReadAll");
export const createOne = createAction("[JOBHISTORY] CreateOne", props<{ jobHistory: JobHistoryCreateModel }>());
export const updateOne = createAction("[JOBHISTORY] UpdateOne", props<{ jobHistory: JobHistoryUpdateModel }>());
export const deleteOne = createAction("[JOBHISTORY] DeleteOne", props<{ employeeId: number, startDate: string }>());

export const updateSorting = createAction("[JOBHISTORY] UpdateSorting", props<{ sortActive: string, asc: boolean }>());
export const updatePagination = createAction("[JOBHISTORY] UpdatePagination", props<{ pageIndex: number, pageSize: number }>());
export const setFilter = createAction("[JOBHISTORY SetFilter]", props<{ filter: JobHistoryFilterModel }>());
export const removeFilter = createAction("[JOBHISTORY RemoveFilter]");

// API ACTIONS
export const readAllSuccess = createAction("[JOBHISTORY API] ReadAllSuccess", props<{ jobHistoryList: JobHistoryDetailModel[] }>());
export const readAllFailure = createAction("[JOBHISTORY API] ReadAllFailure", props<{ error: Error }>());

export const createOneSuccess = createAction("[JOBHISTORY API] CreateOneSuccess", props<{ jobHistory: JobHistoryDetailModel }>())
export const createOneFailure = createAction("[JOBHISTORY API] CreateOneSuccess", props<{ error: Error }>())

export const updateOneSuccess = createAction("[JOBHISTORY API] UpdateOneSuccess", props<{ jobHistory: JobHistoryDetailModel }>())
export const updateOneFailure = createAction("[JOBHISTORY API] UpdateOneFailure", props<{ error: Error }>())

export const deleteOneSuccess = createAction("[JOBHISTORY API] DeleteOneSuccess", props<{ employeeId: number, startDate: string }>());
export const deleteOneFailure = createAction("[JOBHISTORY API] DeleteOneFailure", props<{ error: Error }>());


// FORM ACTIONS

export const openCreateForm = createAction("[JOBHISORY FORM] OpenCreateForm", props<{ jobHistory: JobHistoryCreateModel | null }>());
export const openUpdateForm = createAction("[JOBHISORY FORM] OpenUpdateForm", props<{ jobHistory: JobHistoryUpdateModel }>());
export const openFormSuccess = createAction("[JOBHISORY FORM] OpenFormSuccess", props<{ formId: string }>());
export const closeForm = createAction("[JOBHISORY FORM] CloseForm", props<{ formId: string }>());
export const closeFormSuccess = createAction("[JOBHISORY FORM] CloseFormSuccess");