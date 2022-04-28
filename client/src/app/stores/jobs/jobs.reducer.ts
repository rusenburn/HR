import { createReducer, on } from "@ngrx/store";
import { JobDetailModel } from "src/app/models/jobs/job-detail.model";
import { JobModel } from "src/app/models/jobs/job.model";
import * as JobsActions from "./jobs.actions";

const cloneArrayWithUpdatedItem = function (jobs: JobModel[], job: JobModel): JobModel[] {
    const temp = [...jobs];
    const i = temp.findIndex((c) => c.jobId === job.jobId);
    temp.splice(i, 1, ...[job]);
    return temp;
}

export interface JobsState {
    jobs: JobModel[];
    loading: boolean;
    error: Error | null;
    jobDetail: JobDetailModel | null;
    pageIndex: number;
    pageSize: number;
    ascending: boolean;
    sortActive: string;
}

const initialState: JobsState = {
    jobs: [],
    loading: false,
    error: null,
    jobDetail: null,
    pageIndex: 0,
    pageSize: 20,
    ascending: true,
    sortActive: "jobId"
};

export const reducer = createReducer(
    initialState,
    on(JobsActions.readAll,
        JobsActions.createOne,
        JobsActions.updateOne,
        JobsActions.deleteOne,
        JobsActions.readOneJob,
        (state) => {
            return { ...state, loading: true }
        }
    ),
    on(JobsActions.updatePagination, (state, action) => {
        return { ...state, pageIndex: action.pageIndex, pageSize: action.pageSize };
    }),
    on(JobsActions.updateSorting, (state, action) => {
        return { ...state, ascending: action.asc, sortActive: action.sortActive };
    }),
    on(
        JobsActions.readAllFailure,
        JobsActions.createOneFailure,
        JobsActions.updateOneFailure,
        JobsActions.deleteOneFailure,
        JobsActions.readOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error };
        }
    ),
    on(JobsActions.readAllSuccess,
        (state, action) => {
            console.log(action.jobs);
            return { ...state, loading: false, jobs: action.jobs };
        }
    ),
    on(JobsActions.createOneSuccess,
        (state, action) => {
            return { ...state, loading: false, jobs: [...state.jobs, action.job] }
        }
    ),
    on(
        JobsActions.updateOneSuccess,
        (state, action) => {
            const jobs = cloneArrayWithUpdatedItem(state.jobs, action.job);
            return { ...state, loading: false, jobs };
        }
    ),
    on(
        JobsActions.deleteOneSuccess,
        (state, action) => {
            const jobs = [...state.jobs];
            const index = jobs.findIndex(j => j.jobId === action.jobId);
            jobs.splice(index, 1);
            return { ...state, loading: false, jobs };
        }
    ),
    on(JobsActions.readOneSuccess,
        (state, action) => {
            return { ...state, loading: false, jobDetail: action.jobDetail };
        })

)