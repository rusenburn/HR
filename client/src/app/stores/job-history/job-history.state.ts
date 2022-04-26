import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { JobHistoryState, reducer as jobHistoryReducer } from "./job-history.reducer";


export interface JobHistorySharedState {
    jobHistory: JobHistoryState
}

export const reducers: ActionReducerMap<JobHistorySharedState> = {
    jobHistory: jobHistoryReducer
};
export const metaReducers: MetaReducer<JobHistorySharedState>[] = [];