import { createAction, props } from "@ngrx/store";
import { JobCreateModel } from "src/app/models/jobs/job-create.model";
import { JobUpdateModel } from "src/app/models/jobs/job-update.model";
import { JobModel } from "src/app/models/jobs/job.model";

export const readAll = createAction("[JOBS] ReadAll");
export const createOne = createAction("[JOBS] CreateOne", props<{ job: JobCreateModel }>());
export const updateOne = createAction("[JOBS] UpdateOne", props<{ job: JobUpdateModel }>());
export const deleteOne = createAction("[JOBS] DeleteOne", props<{ id: number }>());


// API ACTIONS
export const readAllSuccess = createAction("[JOBS API] ReadAllSuccess", props<{ jobs: JobModel[] }>());
export const readAllFailure = createAction("[JOBS API] ReadAllFailure", props<{ error: Error }>());

export const createOneSuccess = createAction("[JOBS API] CreateOneSuccess", props<{ job: JobModel }>())
export const createOneFailure = createAction("[JOBS API] CreateOneSuccess", props<{ error: Error }>())

export const updateOneSuccess = createAction("[JOBS API] UpdateOneSuccess", props<{ job: JobModel }>())
export const updateOneFailure = createAction("[JOBS API] UpdateOneFailure", props<{ error: Error }>())

export const deleteOneSuccess = createAction("[JOBS API] DeleteOneSuccess", props<{ jobId: number }>())
export const deleteOneFailure = createAction("[JOBS API] DeleteOneFailure", props<{ error: Error }>())