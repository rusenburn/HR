import { createReducer, on } from "@ngrx/store";
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
}

const initialState: JobsState = {
    jobs: [],
    loading: false,
    error: null
}

export const reducer = createReducer(
    initialState,
    on(JobsActions.readAll,
        JobsActions.createOne,
        JobsActions.updateOne,
        JobsActions.deleteOne,
        (state) => {
            return { ...state, loading: true }
        }
    ),
    on(
        JobsActions.readAllFailure,
        JobsActions.createOneFailure,
        JobsActions.updateOneFailure,
        JobsActions.deleteOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error };
        }
    ),
    on(JobsActions.readAllSuccess,
        (state, action) => {
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
    )

)