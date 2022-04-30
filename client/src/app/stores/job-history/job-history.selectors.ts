import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobHistoryFilterModel } from "src/app/models/job-histories/job-history-filter.model";
import { JobHistoryModel } from "src/app/models/job-histories/job-history.model";
import { JobHistoryState } from "./job-history.reducer";
import { JobHistorySharedState } from "./job-history.state";

const stringComparer = (a: string | null, b: string | null): number => {
    if (a && b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }
    if (b) return -1;
    if (a) return 1;
    return 0;
};

const _selectAllJobHistory = (state: JobHistoryState) => state.jobHistoryCollection;
const _selectLoading = (state: JobHistoryState) => state.loading;
const _selectError = (state: JobHistoryState) => state.error;
const _selectPageIndex = (state: JobHistoryState) => state.pageIndex;
const _selectPageSize = (state: JobHistoryState) => state.pageSize;
const _selectSortActive = (state: JobHistoryState) => state.sortActive;
const _selectAscending = (state: JobHistoryState) => state.ascending;
const _selectFilter = (state: JobHistoryState) => state.filter;

const _filter = (collection: JobHistoryModel[], filter: JobHistoryFilterModel) => {
    if (!filter.departmentId && !filter.employeeId && !filter.jobId) {
        return collection;
    }
    let result = [...collection];
    if (filter.departmentId) {
        result = result.filter(j => j.departmentId === filter.departmentId);
    }
    if (filter.employeeId) {
        result = result.filter(j => j.employeeId === filter.employeeId);
    }
    if (filter.jobId) {
        result = result.filter(j => j.jobId === filter.jobId)
    }
    return result;
}
const _sort = (collection: JobHistoryModel[], sortActive: string, ascending: boolean): JobHistoryModel[] => {
    const result = [...collection];
    switch (sortActive) {
        case "startDate":
            result.sort((a, b) => stringComparer(a.startDate, b.startDate));
            break;
        case "employeeId":
            result.sort((a, b) => a.employeeId - b.employeeId);
            break;
        case "salary":
            result.sort((a, b) => a.salary - b.salary);
            break
        case "jobId":
            result.sort((a, b) => (a.jobId ?? -1) - (b.jobId ?? -1));
            break;
        case "departmentId":
            result.sort((a, b) => (a.departmentId ?? -1) - (b.departmentId ?? -1));
            break;
        default:
            result.sort((a, b) => stringComparer(a.startDate, b.startDate));
    }
    if (ascending) {
        return result
    }
    return result.reverse();
};

const _slice = (collection: JobHistoryModel[], pageIndex: number, pageSize: number) => {

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const sl = collection.slice(start, end);
    return [...sl];
};

export const selectSharedJobHistoryState = createFeatureSelector<JobHistorySharedState>("[JOBHISTORY]");
export const selectJobHistoryState = createSelector(
    selectSharedJobHistoryState,
    (sharedState) => sharedState.jobHistory
);
export const selectAllJobHistory = createSelector(
    selectJobHistoryState,
    _selectAllJobHistory
);

export const selectLoading = createSelector(
    selectJobHistoryState,
    _selectLoading
);

export const selectError = createSelector(
    selectJobHistoryState,
    _selectError
);

export const selectPageIndex = createSelector(
    selectJobHistoryState,
    _selectPageIndex
);

export const selectPageSize = createSelector(
    selectJobHistoryState,
    _selectPageSize
);

export const selectSortActive = createSelector(
    selectJobHistoryState,
    _selectSortActive
);

export const selectAscending = createSelector(
    selectJobHistoryState,
    _selectAscending
);

export const selectFilter = createSelector(
    selectJobHistoryState,
    _selectFilter
);

export const selectFilteredJobHistory = createSelector(
    selectAllJobHistory,
    selectFilter,
    _filter
);

export const selectJobHistoryLength = createSelector(
    selectFilteredJobHistory,
    (collection)=>collection.length
);

export const selectSortedJobHistory = createSelector(
    selectFilteredJobHistory,
    selectSortActive,
    selectAscending,
    _sort
);

export const selectJobHistoryPage = createSelector(
    selectSortedJobHistory,
    selectPageIndex,
    selectPageSize,
    _slice
);