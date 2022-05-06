import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobHistoryDetailModel } from "src/app/models/job-histories/job-history-detail.model";
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
const _selectFormId = (state: JobHistoryState) => state.formId;
const _selectIsCreateForm = (state: JobHistoryState) => state.isCreateForm;
const _selectTextFilter = (state: JobHistoryState) => state.textFilter;

const _filterByText = (collection: JobHistoryModel[]|JobHistoryDetailModel[], textFilter: string): JobHistoryModel[]|JobHistoryDetailModel[] => {
    if (!textFilter.length) {
        return collection;
    }
    textFilter = textFilter.toLocaleLowerCase();
    const result = collection.filter(j =>
        j.employeeId.toString().includes(textFilter) ||
        j.startDate.toLocaleLowerCase().includes(textFilter) ||
        j.salary.toString().includes(textFilter) ||
        j.startDate.toLocaleLowerCase().includes(textFilter) ||
        j.endDate?.toLocaleLowerCase().includes(textFilter)
    );
    return result;
}
const _filterbyKeys = (collection: JobHistoryModel[]|JobHistoryDetailModel[], filter: JobHistoryFilterModel): JobHistoryModel[]|JobHistoryDetailModel[]=> {
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
const _sort = (collection: JobHistoryModel[]|JobHistoryDetailModel[], sortActive: string, ascending: boolean): JobHistoryModel[]|JobHistoryDetailModel[]=> {
    const result = [...collection];
    console.log(sortActive)
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

const _slice = (collection: JobHistoryModel[]|JobHistoryDetailModel[], pageIndex: number, pageSize: number) => {

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

export const selectForeignKeysFilter = createSelector(
    selectJobHistoryState,
    _selectFilter
);


export const selectFormId = createSelector(
    selectJobHistoryState,
    _selectFormId
);

export const selectIsCreateForm = createSelector(
    selectJobHistoryState,
    _selectIsCreateForm
);


export const selectTextFilter = createSelector(
    selectJobHistoryState,
    _selectTextFilter
);

export const selectForeignKeysFilteredJobHistory = createSelector(
    selectAllJobHistory,
    selectForeignKeysFilter,
    _filterbyKeys
);

export const selectFilteredJobHisotryByText = createSelector(
    selectForeignKeysFilteredJobHistory,
    selectTextFilter,
    _filterByText
);

export const selectAllJobHistoryLength = createSelector(
    selectAllJobHistory,
    (collection)=>collection.length
);

export const selectJobHistoryLength = createSelector(
    selectFilteredJobHisotryByText,
    (collection) => collection.length
);

export const selectSortedJobHistory = createSelector(
    selectFilteredJobHisotryByText,
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