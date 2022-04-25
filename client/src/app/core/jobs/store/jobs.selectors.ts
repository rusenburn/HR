import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobsState } from "./jobs.reducer";
import { JobSharedState } from "./jobs.state";


const _selectAllJobs = (state: JobsState) => state.jobs;
const _selectLoading = (state: JobsState) => state.loading;
const _selectJobDetail = (state: JobsState) => state.jobDetail;

export const selectJobsSharedState = createFeatureSelector<JobSharedState>("[JOBS]");

export const selectJobsState = createSelector(
    selectJobsSharedState,
    (sharedState) => sharedState.jobs
);

export const selectAllJobs = createSelector(
    selectJobsState,
    _selectAllJobs
);
export const selectLoading = createSelector(
    selectJobsState,
    _selectLoading
);

export const selectJobDetail = createSelector(
    selectJobsState,
    _selectJobDetail
);
