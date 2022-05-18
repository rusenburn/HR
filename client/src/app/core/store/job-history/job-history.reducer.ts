import { createReducer, on } from "@ngrx/store";
import { JobHistoryDetailModel } from "src/app/models/job-histories/job-history-detail.model";
import { defaultJobHistoryFilter, JobHistoryFilterModel } from "src/app/models/job-histories/job-history-filter.model";
import * as JobHistoryActions from "./job-history.actions";

const cloneArrayWithUpdatedItem = function (jobHistoryCollection: JobHistoryDetailModel[], jobHistory: JobHistoryDetailModel): JobHistoryDetailModel[] {
    const temp = [...jobHistoryCollection];
    const i = temp.findIndex((jh) => jh.employeeId === jobHistory.employeeId && jh.startDate === jobHistory.startDate);
    temp.splice(i, 1, ...[jobHistory]);
    return temp;
};

export interface JobHistoryState {
    jobHistoryCollection: JobHistoryDetailModel[];
    loading: boolean;
    error: Error | null;
    pageIndex: number;
    pageSize: number;
    sortActive: string;
    ascending: boolean;
    filter: JobHistoryFilterModel;
    formId: string;
    isCreateForm: boolean;
    textFilter: string;
}

export const initialState: JobHistoryState = {
    jobHistoryCollection: [],
    loading: false,
    error: null,
    pageIndex: 0,
    pageSize: 10,
    sortActive: "startDate",
    ascending: false,
    filter: { ...defaultJobHistoryFilter },
    formId: "",
    isCreateForm: true,
    textFilter: ""
};

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
    ),
    on(JobHistoryActions.updatePagination, (state, action) => {
        return { ...state, pageIndex: action.pageIndex, pageSize: action.pageSize };
    }),
    on(JobHistoryActions.updateSorting, (state, action) => {
        return { ...state, sortActive: action.sortActive, ascending: action.asc };
    }),
    on(JobHistoryActions.setFilter, (state, action) => {
        return { ...state, filter: action.filter };
    }),
    on(JobHistoryActions.removeFilter, (state) => {
        return { ...state, filter: { ...defaultJobHistoryFilter } }
    }),
    on(JobHistoryActions.openCreateForm, (state) => {
        return { ...state, isCreateForm: true };
    }),
    on(JobHistoryActions.openUpdateForm, (state) => {
        return { ...state, isCreateForm: false };
    }),
    on(JobHistoryActions.openFormSuccess, (state, action) => {
        return { ...state, formId: action.formId };
    }),
    on(JobHistoryActions.closeFormSuccess, (state) => {
        return { ...state, formId: "" };
    }),
    on(JobHistoryActions.textFilterChanged, (state, action) => {
        return { ...state, textFilter: action.textFilter };
    }),
    on(JobHistoryActions.resetTextFilter, (state) => {
        return { ...state, textFilter: "" };
    })
);