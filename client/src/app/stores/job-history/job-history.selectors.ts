import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobHistoryState } from "./job-history.reducer";
import { JobHistorySharedState } from "./job-history.state";


const _selectAllJobHistory = (state: JobHistoryState) => state.jobHistoryCollection;
const _selectLoading = (state: JobHistoryState) => state.loading;

export const selectSharedJobHistoryState = createFeatureSelector<JobHistorySharedState>("[JOBHISTORY]");

export const selectJobHistoryState = createSelector(
    selectSharedJobHistoryState,
    (sharedState) => sharedState.jobHistory
);
export const selectAllJobHistory = createSelector(
    selectJobHistoryState,
    _selectAllJobHistory
)

export const selectLoading = createSelector(
    selectJobHistoryState,
    _selectLoading
)