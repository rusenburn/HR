import { createReducer, on } from "@ngrx/store";
import { JobHistoryDetailModel } from "src/app/models/job-histories/job-history-detail.model";
import * as JobHistoryActions from "./job-history.actions";

const cloneArrayWithUpdatedItem = function (jobHistoryCollection: JobHistoryDetailModel[], jobHistory: JobHistoryDetailModel): JobHistoryDetailModel[] {
    const temp = [...jobHistoryCollection];
    const i = temp.findIndex((jh) => jh.employeeId === jobHistory.employeeId && jh.startDate === jobHistory.startDate);
    temp.splice(i, 1, ...[jobHistory]);
    return temp;
}

export interface JobHistoryState {
    jobHistoryCollection: JobHistoryDetailModel[];
    loading: boolean;
    error: Error | null;
}

export const initialState: JobHistoryState = {
    jobHistoryCollection: [],
    loading: false,
    error: null
}

export const reducer = createReducer(
    initialState,
    on(JobHistoryActions.readAll,
        JobHistoryActions.createOne,
        JobHistoryActions.deleteOne,
        JobHistoryActions.updateOne,
        (state) => {
            return { ...state, loading: true };
        }
    ),
    on(JobHistoryActions.readAllFailure,
        JobHistoryActions.createOneFailure,
        JobHistoryActions.updateOneFailure,
        JobHistoryActions.deleteOneFailure,
        (state, action) => {
            return { ...state, loading: false, error: action.error }
        }
    ),
    on(
        JobHistoryActions.readAllSuccess,
        (state, action) => {
            return { ...state, loading: false, jobHistoryCollection: [...action.jobHistoryList] }
        }
    ),

    on(
        JobHistoryActions.createOneSuccess,
        (state, action) => {
            return { ...state, loading: false, jobHistoryCollection: [action.jobHistory, ...state.jobHistoryCollection,] };
        }
    ),
    on(JobHistoryActions.updateOneSuccess,
        (state, action) => {
            const jobHistoryCollection = cloneArrayWithUpdatedItem(state.jobHistoryCollection, action.jobHistory);
            return { ...state, loading: false, jobHistoryCollection };
        }
    ),
    on(JobHistoryActions.deleteOneSuccess,
        (state, action) => {
            const jobHistoryCollection = [...state.jobHistoryCollection];
            const index = jobHistoryCollection.findIndex(
                (jh) => jh.employeeId === action.employeeId &&
                    jh.startDate === action.startDate);
            jobHistoryCollection.splice(index, 1);
            return { ...state, loading: false, jobHistoryCollection };
        }
    )
)