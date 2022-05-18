import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobModel } from "src/app/models/jobs/job.model";
import { JobsState } from "./jobs.reducer";
import { JobSharedState } from "./jobs.state";

const stringComparer = (a: string | null, b: string | null): number => {
    if (a && b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }
    if (b) return -1;
    if (a) return 1;
    return 0;
}

const _selectAllJobs = (state: JobsState) => state.jobs;
const _selectLoading = (state: JobsState) => state.loading;
const _selectJobDetail = (state: JobsState) => state.jobDetail;

const _selectPageIndex = (state: JobsState) => state.pageIndex;
const _selectPageSize = (state: JobsState) => state.pageSize;
const _selectSortActive = (state: JobsState) => state.sortActive;
const _selectAscending = (state: JobsState) => state.ascending;

const _selectFormId = (state: JobsState) => state.formId;
const _selectTextFilter = (state: JobsState) => state.textFilter;


const _filterByText = (jobs: JobModel[], textFilter: string): JobModel[] => {
    if (!textFilter.length) {
        return jobs;
    }
    textFilter = textFilter.toLocaleLowerCase();
    const result = jobs.filter(j =>
        j.jobId.toString().includes(textFilter) ||
        j.jobTitle.toLocaleLowerCase().includes(textFilter) ||
        j.maxSalary.toString().includes(textFilter) ||
        j.minSalary.toString().includes(textFilter)
    );
    return result;
}
const _sort = (jobs: JobModel[], sortActive: string, ascending: boolean): JobModel[] => {
    const result = [...jobs];
    switch (sortActive) {
        case "jobId":
            result.sort((a, b) => a.jobId - b.jobId);
            break;
        case "jobTitle":
            result.sort((a, b) => stringComparer(a.jobTitle, b.jobTitle));
            break;

        case "minSalary":
            result.sort((a, b) => a.minSalary - b.minSalary);
            break
        case "maxSalary":
            result.sort((a, b) => a.maxSalary - b.maxSalary);
            break;
        default:
            result.sort((a, b) => a.jobId - b.jobId);
            break;
    }
    if (ascending) return result;
    return result.reverse();
}

const _slice = (jobs: JobModel[], pageIndex: number, pageSize: number): JobModel[] => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const sl = jobs.slice(start, end);
    return [...sl];
}

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

export const selectPageIndex = createSelector(
    selectJobsState,
    _selectPageIndex
);
export const selectPageSize = createSelector(
    selectJobsState,
    _selectPageSize
);
export const selectSortActive = createSelector(
    selectJobsState,
    _selectSortActive
);
export const selectAscending = createSelector(
    selectJobsState,
    _selectAscending
);

export const selectFormId = createSelector(
    selectJobsState,
    _selectFormId
);


export const selectTextFilter = createSelector(
    selectJobsState,
    _selectTextFilter
);

export const selectFilteredJobs = createSelector(
    selectAllJobs,
    selectTextFilter,
    _filterByText
);

export const selectSortedJobs = createSelector(
    selectFilteredJobs,
    selectSortActive,
    selectAscending,
    _sort
);

export const selectJobsPage = createSelector(
    selectSortedJobs,
    selectPageIndex,
    selectPageSize,
    _slice
);

export const selectJobsLength = createSelector(
    selectAllJobs,
    (jobs) => jobs.length
);

export const selectFilteredJobsLength = createSelector(
    selectFilteredJobs,
    (jobs)=>jobs.length
)