import { createAction, props } from "@ngrx/store";
import { JobCreateModel } from "src/app/models/jobs/job-create.model";
import { JobDetailModel } from "src/app/models/jobs/job-detail.model";
import { JobQueryModel } from "src/app/models/jobs/job-query.model";
import { JobUpdateModel } from "src/app/models/jobs/job-update.model";
import { JobModel } from "src/app/models/jobs/job.model";

export const readAll = createAction("[JOBS] ReadAll", props<JobQueryModel>());
export const createOne = createAction("[JOBS] CreateOne", props<{ job: JobCreateModel }>());
export const updateOne = createAction("[JOBS] UpdateOne", props<{ job: JobUpdateModel }>());
export const deleteOne = createAction("[JOBS] DeleteOne", props<{ id: number }>());

export const updatePagination = createAction("[JOBS] UpdatePagination", props<{ pageIndex: number, pageSize: number }>());
export const updateSorting = createAction("[JOBS] UpdateSorting", props<{ sortActive: string, asc: boolean }>());
export const textFilterChanged = createAction("[JOBS] TextFilterChanged",props<{textFilter:string}>());
export const resetTextFilter = createAction("[JOBS] ResetTextFilter");
// Route ACTIONS
export const readOneJob = createAction("[JOBS PARAM] ReadOne", props<{ jobId: number }>());

// API ACTIONS
export const readAllSuccess = createAction("[JOBS API] ReadAllSuccess", props<{ jobs: JobModel[] }>());
export const readAllFailure = createAction("[JOBS API] ReadAllFailure", props<{ error: Error }>());

export const createOneSuccess = createAction("[JOBS API] CreateOneSuccess", props<{ job: JobModel }>());
export const createOneFailure = createAction("[JOBS API] CreateOneSuccess", props<{ error: Error }>());

export const updateOneSuccess = createAction("[JOBS API] UpdateOneSuccess", props<{ job: JobModel }>());
export const updateOneFailure = createAction("[JOBS API] UpdateOneFailure", props<{ error: Error }>());

export const deleteOneSuccess = createAction("[JOBS API] DeleteOneSuccess", props<{ jobId: number }>());
export const deleteOneFailure = createAction("[JOBS API] DeleteOneFailure", props<{ error: Error }>());

export const readOneSuccess = createAction("[JOBS PARAM] ReadOneSuccess", props<{ jobDetail: JobDetailModel }>());
export const readOneFailure = createAction("[JOBS PARAM] ReadOneFailure", props<{ error: Error }>());


// FORM
export const openForm = createAction("[JOBS FORM] OpenForm", props<{ job: JobUpdateModel|null }>());
export const openFormSuccess = createAction("[JOBB FORM] OpenFormSuccess", props<{ formId: string }>());
export const closeForm = createAction("[JOBS FORM] CloseForm", props<{ formId: string }>());
export const closeFormSuccess = createAction("[JOBS FORM] CloseFormSuccess");
